import User from '@models/User';

test('It should be ok', () => {
  const user = new User();

  user.name = 'William';

  expect(user.name).toEqual('William');
});
