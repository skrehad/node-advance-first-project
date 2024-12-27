import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    await seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`App is listening on Port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
}

main();

//  aita hoilo server a kono prb hoile server imediatly off hoiya jay but aita thik na akhon ekta wronging diya off hoivo
process.on('unhandledRejection', () => {
  console.log(`😈 unhandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//  ar aita hoilo amar code a kono vul thakle server off hoiya jaivo
process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
