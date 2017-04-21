import { SortOnLikePipe } from './sort-on-like.pipe';

describe('SortOnLikePipe', () => {

  const testArray = [
    {
      email: "martin1@martin.com",
      votes: 23
    },
    {
      email: "martin2@martin.com",
      votes: 50
    },
    {
      email: "martin3@martin.com",
      votes: 10
    },
    {
      email: "martin4@martin.com",
      votes: 80
    }
];


  it('create an instance', () => {
    const pipe = new SortOnLikePipe();
    expect(pipe).toBeTruthy();
  });

  it('creates an instance an sorts on votes desending', () => {
    const pipe = new SortOnLikePipe();
    expect(pipe).toBeTruthy();
    const sortedList = pipe.transform(testArray, 'votes', false);
    expect(sortedList).toEqual([
      {
        email: "martin4@martin.com",
        votes: 80
      },
      {
        email: "martin2@martin.com",
        votes: 50
      },
      {
        email: "martin1@martin.com",
        votes: 23
      },
      {
        email: "martin3@martin.com",
        votes: 10
      }
    ]);
  })

  it('creates an instance an sorts on votes acsending', () => {
    const pipe = new SortOnLikePipe();
    expect(pipe).toBeTruthy();
    const sortedList = pipe.transform(testArray, 'votes', true);
    expect(sortedList).toEqual([
      {
        email: "martin3@martin.com",
        votes: 10
      },
      {
        email: "martin1@martin.com",
        votes: 23
      },
      {
        email: "martin2@martin.com",
        votes: 50
      },
      {
        email: "martin4@martin.com",
        votes: 80
      }
    ]);
  })

  it('creates an instance an sorts on email desending', () => {
    const pipe = new SortOnLikePipe();
    expect(pipe).toBeTruthy();
    const sortedList = pipe.transform(testArray, 'email', false);
    expect(sortedList).toEqual([
      {
        email: "martin4@martin.com",
        votes: 80
      },
      {
        email: "martin3@martin.com",
        votes: 10
      },
      {
        email: "martin2@martin.com",
        votes: 50
      },
      {
        email: "martin1@martin.com",
        votes: 23
      }
    ]);
  })

  it('creates an instance an sorts email acsending', () => {
    const pipe = new SortOnLikePipe();
    expect(pipe).toBeTruthy();
    const sortedList = pipe.transform(testArray, 'email', true);
    expect(sortedList).toEqual([
      {
        email: "martin1@martin.com",
        votes: 23
      },
      {
        email: "martin2@martin.com",
        votes: 50
      },
      {
        email: "martin3@martin.com",
        votes: 10
      },
      {
        email: "martin4@martin.com",
        votes: 80
      }
    ]);
  })

});
