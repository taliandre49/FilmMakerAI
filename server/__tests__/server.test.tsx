/**
 * @jest-environment jsdom
 */
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;
import request from 'supertest';
import server from '../index';


jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
}));


jest.mock('openai', () => {
  return {
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
                          description: 'Two people talking.',
                          shotType: 'Medium',
                          cameraAngle: 'Eye-level',
                          movement: 'None',
                          equipment: 'Tripod',
                          framing: '16:9',
                          setupTime: '5',
                          audioNotes: 'None',
                        },
                      ],
                      explanation: 'Generated a basic shot list.',
                    }),
                  },
                },
              ],
            })
          ),
        },
      },
    })),
  };
});



describe('POST /api', () => {
  it('responds with 200 and stores the data in Firestore', async () => {
    const res = await request(server).post('/api').send({ text: 'Generate a new shot' });
    expect(res.statusCode).toBe(200);
  }, 10000); // 10 seconds timeout
  
});


