import Props from '../Props';

const propsSchema = {
  description: '',
  displayName: 'ImageCard',
  methods: [],
  props: {
    user: {
      type: {
        name: 'shape',
        value: {
          avatar: {
            name: 'any',
            required: false,
          },
          nick: {
            name: 'string',
            required: false,
          },
          signature: {
            name: 'string',
            required: false,
          },
          test: {
            name: 'shape',
            value: {
              a: {
                name: 'string',
                required: false,
              },
              b: {
                name: 'string',
                required: false,
              },
            },
            required: false,
          },
        },
      },
      required: false,
      description: '',
      defaultValue: {
        value: '{"avatar": "avatarPlaceholder",\n  "nick": "Avatar",\n  "signature": "To be or not to be."}',
        computed: false,
      },
    },
  },
};

describe('Props', () => {
  let model;

  before(() => {
    model = new Props(propsSchema);
  });

  it('should set the default value of propsSchema', () => {
    const expected = JSON.stringify({
      user: {
        avatar: 'avatarPlaceholder',
        nick: 'Avatar',
        signature: 'To be or not to be.',
        test: {
          a: '',
          b: '',
        },
      },
    });

    JSON.stringify(model.data).should.equal(expected);
  });
});
