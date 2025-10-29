import prisma from '../config/prisma';
import { uploadBufferToGcs } from '../utils/gcs';
import { randomUUID } from "crypto";
import { VertexAI } from "@google-cloud/vertexai";

export class GenerationService {
  static async createVariant(product: any, prompt: string) {
    try {
      // Init Vertex AI
      const vertex = new VertexAI({
        project: process.env.GCP_PROJECT,
        location: "us-central1",
      });
      const model = vertex.getGenerativeModel({
        model: "gemini-2.5-flash-image",
      });
  
      // Fetch product image
      const imageResp = await fetch(product.imageUrl);
      if (!imageResp.ok) throw new Error("Failed to fetch product image");
  
      const imageBuffer = Buffer.from(await imageResp.arrayBuffer());
      const base64Image = imageBuffer.toString("base64");
  
      // Generate new image
      const request = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image,
                },
              },
            ],
          },
        ],
      };
  
      const result = await model.generateContent(request);
      const response = await result.response;
  
      // Extract image
      const part = response.candidates?.[0]?.content?.parts?.find(
        (p: any) => p.inlineData
      );
      if (!part?.inlineData?.data)
        throw new Error("Vertex AI did not return image data");
  
      const buffer = Buffer.from(part.inlineData.data, "base64");
  
      // Upload to GCS
      const resultUrl = await uploadBufferToGcs(
        buffer,
        `${randomUUID()}.jpg`,
        "image/jpeg"
      );
  
      // Only create DB entry if successful
      await prisma.generation.create({
        data: {
          productId: product.id,
          prompt,
          status: "completed",
          resultUrl,
        },
      });
  
      return { success: true, resultUrl };
    } catch (err: any) {
      console.error("Generation failed:", err.message);
      return { success: false, error: err.message };
    }
  }

  static async listByProduct(productId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [generations, total] = await Promise.all([
      prisma.generation.findMany({ 
        where: { productId }, 
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.generation.count({ where: { productId } })
    ]);

    return {
      data: generations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  static async runGeneration(generationId: string): Promise<void> {
    // Simulate an AI call: create a tiny placeholder image buffer
    const pngHeader = Buffer.from('89504e470d0a1a0a', 'hex');
    const fakeImage = Buffer.concat([pngHeader]);
    const url = await uploadBufferToGcs(fakeImage, 'result.png', 'image/png');
    await prisma.generation.update({ where: { id: generationId }, data: { status: 'completed', resultUrl: url } });
  }

  static async markFailed(generationId: string, error: string) {
    await prisma.generation.update({ where: { id: generationId }, data: { status: 'failed', error } });
  }
}

