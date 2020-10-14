import {
  connect
} from 'mongoose';
const database_URI = process.env.DATABASE_URI;

export async function connectMongoDB() {

  try {
    const connection = await connect(database_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true // to hide deprication error warning message in terminal
    });

    () => setTimeout(() => {
      console.log("\nConnection to MongoDB is successful!  (●'◡'●)\n");
    }, 500)


    // Displaying info of successful conntection
    const {
      name,
      host,
      port,
    } = connection.connections[0];

    console.log(
      `Info of connected datebase:
          Host: ${host} 
          Name: ${name} 
          Port: ${port}
      `
    );
  } catch (err) {
    console.log("\nFailed to connect to MongoDB!\n");
    console.log(err);
  }
}