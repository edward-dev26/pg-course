const request = require('supertest');
const createApp = require('../../app');
const usersRepo = require('../../repositories/users.repository');
const Context = require('../context');

let context;

beforeAll(async () => {
    context = await Context.build();
});

afterAll(() => {
    return context?.cleanup();
});

beforeAll(async () => {
    return await context.reset();
})

it('Create a user', async () => {
    const app = createApp();
    const startingCount = await usersRepo.getCount();

    expect(startingCount).toEqual(0);

    await request(app)
        .post('/users')
        .send({username: 'testuser', bio: 'test bio'})
        .expect(201);

    const finishCount = await usersRepo.getCount();

    expect(finishCount).toEqual(1);
});

it('Get a user', async () => {
    const app = createApp();
    const initialUser = await usersRepo.insert({
        username: 'John',
        bio: 'This is me'
    });

    await request(app)
        .get(`/users/${initialUser.id}`)
        .expect(200)
        .expect(initialUser);
});
