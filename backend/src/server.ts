import app from './app';
import { prisma } from './lib/prisma';
import redisClient from './lib/redis';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 Job Portal & Prep API running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Health check available at: http://localhost:${PORT}/api/v1/health`);
  console.log(`========================================================`);
});

// Graceful shutdown handling
const handleGracefulShutdown = async (signal: string) => {
  console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    try {
      await prisma.$disconnect();
      console.log('[Prisma] Disconnected from database.');
      if (redisClient) {
        await redisClient.quit();
        console.log('[Redis] Connection closed.');
      }
      process.exit(0);
    } catch (err) {
      console.error('[Server] Error during teardown:', err);
      process.exit(1);
    }
  });

  // Force exit if hanging
  setTimeout(() => {
    console.error('[Server] Forcing shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
