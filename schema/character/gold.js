import schema from 'schm';

export default schema({
  handful: {
    type: Number,
    max: 5,
  },
  bag: {
    type: Number,
    max: 4,
  },
  chest: {
    type: Number,
    max: 3,
  },
  hoard: {
    type: Number,
    max: 2,
  },
  fortune: {
    type: Number,
    max: 1,
  },
});
