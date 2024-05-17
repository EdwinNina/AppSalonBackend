import { SeedData } from "./seed";

const seed = new SeedData();

if(process.argv.includes('--data')) {
   seed.seedDB();
} else {
   seed.clearDB();
}