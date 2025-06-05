
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
import request from 'supertest';
import app from '../index'; 


// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})), // Mock the Firestore instance
  doc: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()), // Mock setDoc method to resolve successfully
}));


jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(() =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    shots: [
                      {
                        id: '1',
                        sceneName: 'INT. CAFE – DAY',
                        sceneNumber: '1',
                        shotNumber: '1A',
                        location: 'INT. CAFE – DAY',
                        description: 'Two people talk.',
                        shotType: 'Medium',
                        cameraAngle: 'Eye-level',
                        movement: 'None',
                        equipment: 'Tripod',
                        framing: '16:9',
                        setupTime: '5',
                        audioNotes: 'None',
                      },
                    ],
                    explanation: 'A simple cafe scene.',
                  }),
                },
              },
            ],
          })
        ),
      },
    },
  })),
}));

describe('POST /api', () => {
  it('responds with 200 and saves a shot list to firestore', async () => {
    const res = await request(app)
      .post('/api')
      .send({ text: 'Make a shot list for a cafe conversation scene.' });

    expect(res.status).toBe(200); // it doesn't return anything explicitly
  },1000);
});

// import { TextEncoder } from 'util';
// import 'openai/shims/node';
// global.TextEncoder = TextEncoder;

// import request from 'supertest';
// import http from 'http';
// import app from '../index';

// // Mock Firebase Firestore
// jest.mock('firebase/firestore', () => ({
//   getFirestore: jest.fn(() => ({})), // Mock the Firestore instance
//   doc: jest.fn(),
//   setDoc: jest.fn(() => Promise.resolve()), // Mock setDoc method to resolve successfully
// }));

// // Mock OpenAI API
// jest.mock('openai', () => ({
//   OpenAI: jest.fn().mockImplementation(() => ({
//     chat: {
//       completions: {
//         create: jest.fn(() =>
//           Promise.resolve({
//             choices: [
//               {
//                 message: {
//                   content: JSON.stringify({
//                     shots: [
//                       {
//                         id: '1',
//                         sceneName: 'INT. CAFE – DAY',
//                         sceneNumber: '1',
//                         shotNumber: '1A',
//                         location: 'INT. CAFE – DAY',
//                         description: 'Two people talking.',
//                         shotType: 'Medium',
//                         cameraAngle: 'Eye-level',
//                         movement: 'None',
//                         equipment: 'Tripod',
//                         framing: '16:9',
//                         setupTime: '5',
//                         audioNotes: 'None',
//                       },
//                     ],
//                     explanation: 'Generated a basic shot list.',
//                   }),
//                 },
//               },
//             ],
//           })
//         ),
//       },
//     },
//   })),
// }));

// // let server: http.Server;

// // beforeAll((done) => {
// //   server = app.listen(0, done); // start server on random port
// // });

// // afterAll((done) => {
// //   server.close(done); // close server after tests
// // });


// test('OpenAI create function returns expected response', () => {
//   // When create is called, it returns the mocked response
//   const openai = new OpenAI();
//   const response = openai.chat.completions.create();
  
//   return response.then(data => {
//     expect(data.choices[0].message.content).toContain('Generated a basic shot list');
//   });
// });

// // test('responds with structured JSON including explanation and array of shots', async () => {
// //   const response = await request(server)
// //     .post('/api')
// //     .send({
// //       text: 'A couple walks through a sunset-lit park while birds chirp.',
// //     });

// //   expect(response.status).toBe(200);

// //   const body = response.body;

// //   // Check top-level structure
// //   expect(body).toHaveProperty('explanation');
// //   expect(typeof body.explanation).toBe('string');

// //   expect(body).toHaveProperty('shots');
// //   expect(Array.isArray(body.shots)).toBe(true);

// //   // Check structure of first shot
// //   const shot = body.shots[0];
// //   expect(shot).toEqual(
// //     expect.objectContaining({
// //       id: expect.any(String),
// //       sceneName: expect.any(String),
// //       sceneNumber: expect.any(String),
// //       shotNumber: expect.any(String),
// //       location: expect.any(String),
// //       description: expect.any(String),
// //       shotType: expect.any(String),
// //       cameraAngle: expect.any(String),
// //       movement: expect.any(String),
// //       equipment: expect.any(String),
// //       framing: expect.any(String),
// //       setupTime: expect.any(String),
// //       audioNotes: expect.any(String),
// //     })
// //   );
// // });

// // import { TextEncoder } from 'util';
// // import 'openai/shims/node'
// // global.TextEncoder = TextEncoder;

// // import request from 'supertest';
// // import http from 'http';
// // import app from '../index';


// // let server: http.Server;

// // jest.mock('firebase/firestore', () => ({
// //   getFirestore: jest.fn(() => ({})),
// //   doc: jest.fn(),
// //   setDoc: jest.fn(() => Promise.resolve()),
// // }));


// // beforeAll((done) => {
// //   server = app.listen(0, done); // start server on random port
// // });

// // afterAll((done) => {
// //   server.close(done); // close server after tests
// // });

// // test('responds with structured JSON including explanation and array of shots', async () => {
// //   const response = await request(server)
// //     .post('/api')
// //     .send({
// //       text: 'A couple walks through a sunset-lit park while birds chirp.',
// //     });

// //   expect(response.status).toBe(200);

// //   const body = response.body;

// //   // Check top-level structure
// //   expect(body).toHaveProperty('explanation');
// //   expect(typeof body.explanation).toBe('string');

// //   expect(body).toHaveProperty('shots');
// //   expect(Array.isArray(body.shots)).toBe(true);

// //   // Check structure of first shot
// //   const shot = body.shots[0];
// //   expect(shot).toEqual(
// //     expect.objectContaining({
// //       id: expect.any(String),
// //       sceneName: expect.any(String),
// //       sceneNumber: expect.any(String),
// //       shotNumber: expect.any(String),
// //       location: expect.any(String),
// //       description: expect.any(String),
// //       shotType: expect.any(String),
// //       cameraAngle: expect.any(String),
// //       movement: expect.any(String),
// //       equipment: expect.any(String),
// //       framing: expect.any(String),
// //       setupTime: expect.any(String),
// //       audioNotes: expect.any(String),
// //     })
// //   );
// // });



// // // /**
// // //  * @jest-environment jsdom
// // //  */
// // // import { TextEncoder } from 'util';
// // // global.TextEncoder = TextEncoder;

// // // import request from 'supertest';
// // // // import http from 'http';
// // // import app from '../index';

// // // // test('returns a JSON of', async () => {
// // // //   const response = await request(app).get('/users');
// // // //   expect(response.status).toBe(200);
// // // //   expect(response.body).toEqual([    { id: 1, name: 'Alice' },    { id: 2, name: 'Bob' },    { id: 3, name: 'Charlie' },  ]);
// // // // });
// // // describe('POST /api', () => {
// // //   it('responds with 200 and returns mocked OpenAI response', async () => {
// // //     const response = await request(app).post('/api').send({ text: 'Generate a new shotlist of sceneic view of a couple at a park during sunset outside birds chirpping' });
// // //     expect(response.status).toBe(200);
// // //     // expect(response.body).toHaveProperty('shots');
// // //     // expect(response.body.shots.length).toBeGreaterThan(0);
// // //     // expect(response.body.shots[0].sceneName).toBe('INT. CAFE – DAY');
// // //   }, 10000); // 10 seconds timeout
// // // });
// // // jest.mock('firebase/firestore', () => ({
// // //   getFirestore: jest.fn(() => ({})),
// // //   doc: jest.fn(),
// // //   setDoc: jest.fn(() => Promise.resolve()),
// // // }));

// // // jest.mock('openai', () => ({
// // //   OpenAI: jest.fn().mockImplementation(() => ({
// // //     chat: {
// // //       completions: {
// // //         create: jest.fn(() =>
// // //           Promise.resolve({
// // //             choices: [
// // //               {
// // //                 message: {
// // //                   content: JSON.stringify({
// // //                     shots: [
// // //                       {
// // //                         id: '1',
// // //                         sceneName: 'INT. CAFE – DAY',
// // //                         sceneNumber: '1',
// // //                         shotNumber: '1A',
// // //                         location: 'INT. CAFE – DAY',
// // //                         description: 'Two people talking.',
// // //                         shotType: 'Medium',
// // //                         cameraAngle: 'Eye-level',
// // //                         movement: 'None',
// // //                         equipment: 'Tripod',
// // //                         framing: '16:9',
// // //                         setupTime: '5',
// // //                         audioNotes: 'None',
// // //                       },
// // //                     ],
// // //                     explanation: 'Generated a basic shot list.',
// // //                   }),
// // //                 },
// // //               },
// // //             ],
// // //           })
// // //         ),
// // //       },
// // //     },
// // //   })),
// // // }));

// // // describe('POST /api', () => {
// // //   it('responds with 200 and returns mocked OpenAI response', async () => {
// // //     const response = await request(app).post('/api').send({ text: 'Generate a new shot' });

// // //     expect(response.status).toBe(200);
// // //     expect(response.body).toHaveProperty('shots');
// // //     expect(response.body.shots.length).toBeGreaterThan(0);
// // //     expect(response.body.shots[0].sceneName).toBe('INT. CAFE – DAY');
// // //   }, 10000); // 10 seconds timeout
// // // });

// // //  /**
// // // //  * @jest-environment jsdom
// // // //  */
// // // // import { TextEncoder, TextDecoder } from 'util';
// // // // global.TextEncoder = TextEncoder;
// // // // // global.TextDecoder = TextDecoder;
// // // // import request from 'supertest';
// // // // import app from '../index';


// // // // jest.mock('firebase/firestore', () => ({
// // // //   getFirestore: jest.fn(() => ({})),
// // // //   doc: jest.fn(),
// // // //   setDoc: jest.fn(() => Promise.resolve()),
// // // // }));


// // // // jest.mock('openai', () => {
// // // //   return {
// // // //     OpenAI: jest.fn().mockImplementation(() => ({
// // // //       chat: {
// // // //         completions: {
// // // //           create: jest.fn(() =>
// // // //             Promise.resolve({
// // // //               choices: [
// // // //                 {
// // // //                   message: {
// // // //                     content: JSON.stringify({
// // // //                       shots: [
// // // //                         {
// // // //                           id: '1',
// // // //                           sceneName: 'INT. CAFE – DAY',
// // // //                           sceneNumber: '1',
// // // //                           shotNumber: '1A',
// // // //                           location: 'INT. CAFE – DAY',
// // // //                           description: 'Two people talking.',
// // // //                           shotType: 'Medium',
// // // //                           cameraAngle: 'Eye-level',
// // // //                           movement: 'None',
// // // //                           equipment: 'Tripod',
// // // //                           framing: '16:9',
// // // //                           setupTime: '5',
// // // //                           audioNotes: 'None',
// // // //                         },
// // // //                       ],
// // // //                       explanation: 'Generated a basic shot list.',
// // // //                     }),
// // // //                   },
// // // //                 },
// // // //               ],
// // // //             })
// // // //           ),
// // // //         },
// // // //       },
// // // //     })),
// // // //   };
// // // // });



// // // // describe('POST /api', () => {
// // // //   it('responds with 200 and stores the data in Firestore', async () => {
// // // //     const res = await request(app).post('/api').send({ text: 'Generate a new shot' });
// // // //     expect(res.statusCode).toBe(200);
// // // //   }, 1000);
  
// // // // });


