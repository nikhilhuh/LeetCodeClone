const problems = {
  id: 1,
  title: "Find the Pair with Target Sum",
  description:
    "Given an array of integers 'nums' and an integer 'target', return the indices of the two numbers such that they add up to 'target' .",
  assumption:
    "Assume there is exactly one solution, and you may not use the same element twice.",
  difficulty: "Easy",
  examples: [
    {
      input: { nums: [2, 7, 11, 15], target: 9 },
      output: [0, 1],
      explanation: "The pair 2 and 7 (at indices 0 and 1) add up to 9.",
    },
    {
      input: { nums: [3, 3], target: 6 },
      output: [0, 1],
      explanation: "The pair 3 and 3 (at indices 0 and 1) add up to 6.",
    },
  ],
  constraints: [
    "2 <= nums.length <= 104" ,
    "-109 <= nums[i] <= 109" ,
    "-109 <= target <= 109" ,
    "Only one valid answer exists."
  ],
  cases: [
    // test cases checked on the server only
    { input: {nums: [2, 7, 11, 15], target: 9 }, output: "[0, 1]" },
    { input: {nums: [3, 3], target: 6 }, output: "[0, 1]" },
    { input: {nums: [1, 2, 3, 4], target: 8 }, output: "null" },
    { input: {nums: [10, 20, 30, 40], target: 25 }, output: "null" },
    { input: {nums: [5, 6, 7, 8], target: 13 }, output: "[0, 3]" },
    { input: {nums: [-1, -2, -3, -4], target: -7 }, output: "[2, 3]" },
    { input: {nums: [100, 200, 300], target: 500 }, output: "[1, 2]" },
  ],
};

module.exports = problems;
