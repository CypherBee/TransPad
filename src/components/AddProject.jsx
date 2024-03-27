import db from './firebase.js';
import {addDoc} from 'firebase/firestore';


const newProject = {
    Name: "Pepe",
    Participants: [
      "0xd685F9A87f5Cbd534824BF1dea581a8DE083f2DA",
      "0x7d5549df4e94a29660ae30999d2c7fa76542f879",
      "0x6d5549df4e94a29660ae30999d2c7fa76542f879",
      "0x5d5549df4e94a29660ae30999d2c7fa76542f879",
      "0x4d5549df4e94a29660ae30999d2c7fa76542f879",
      "0x3d5549df4e94a29660ae30999d2c7fa76542f879",
      "0x2d5549df4e94a29660ae30999d2c7fa76542f879",
      "0x1d5549df4e94a29660ae30999d2c7fa76542f879"],
    PhotoUrl: "https://firebasestorage.googleapis.com/v0/b/transpad-7f889.appspot.com/o/pepe.jpg?alt=media&token=43efaf4b-eab3-48e3-8de2-65f612cb0770",
    RaiseGoal: 50,
    SaleEnds: new Date('March 8, 2024 07:01:37 AM UTC+2')
  };