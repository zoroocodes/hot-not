import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { winnerId, loserId } = body;

    console.log('Processing vote:', { winnerId, loserId });

    if (!winnerId || !loserId) {
      console.error('Missing required fields:', { winnerId, loserId });
      return NextResponse.json(
        { error: 'Winner and loser IDs are required' },
        { status: 400 }
      );
    }

    // Verify both cryptos exist before voting
    const [winner, loser] = await Promise.all([
      prisma.cryptocurrency.findUnique({ where: { id: winnerId } }),
      prisma.cryptocurrency.findUnique({ where: { id: loserId } })
    ]);

    if (!winner || !loser) {
      console.error('Crypto not found:', { winner, loser });
      return NextResponse.json(
        { error: 'One or both cryptocurrencies not found' },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update winner
      const updatedWinner = await tx.cryptocurrency.update({
        where: { id: winnerId },
        data: {
          wins: { increment: 1 },
          total_votes: { increment: 1 }
        }
      });

      // Update loser
      const updatedLoser = await tx.cryptocurrency.update({
        where: { id: loserId },
        data: {
          losses: { increment: 1 },
          total_votes: { increment: 1 }
        }
      });

      // Record vote
      const vote = await tx.vote.create({
        data: {
          winnerId,
          loserId
        }
      });

      return {
        winner: updatedWinner,
        loser: updatedLoser,
        vote
      };
    });

    console.log('Vote recorded successfully:', result);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Vote processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}