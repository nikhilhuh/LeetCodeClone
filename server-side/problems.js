const problems = {
  id: 1,
  title: "Find the Pair with Target Sum",
  description:
    "Given an array of integers 'nums' and an integer 'target', return the indices of the two numbers such that they add up to 'target' .",
  assumption:
    "Assume there is exactly one solution, and you may not use the same element twice.",
  difficulty: "Easy",
  functionName: "twoSum",
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
    "2 <= nums.length <= 104",
    "-109 <= nums[i] <= 109",
    "-109 <= target <= 109",
    "Only one valid answer exists.",
  ],
  cases: [
    // Test cases checked on the server only
    { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
    { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] },
    { input: { nums: [1, 2, 3, 4], target: 8 }, expectedOutput: null },
    { input: { nums: [10, 20, 30, 40], target: 25 }, expectedOutput: null },
    { input: { nums: [5, 6, 7, 8], target: 13 }, expectedOutput: [1, 2] },
    { input: { nums: [-1, -2, -3, -4], target: -7 }, expectedOutput: [2, 3] },
    { input: { nums: [100, 200, 300], target: 500 }, expectedOutput: [1, 2] },
  ],  
  skeleton_code: {
    c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
  },

  boilerplatecodes: {
    c: `#include <stdio.h>
    #include <stdlib.h>
    
    {userCode}
    
    int main() {
      int* result;
      int returnSize;
      
      // Test cases
      {testCases}
      return 0;
    }
    `,

    cpp: `
    #include <iostream>
    #include <vector>
    using namespace std;
    {userCode}

    int main() {
      Solution sol;
      // Test cases
      {testCases}
      return 0;
    }`,

    java: `
    {userCode}

      public static void main(String[] args) {
        Solution sol = new Solution();
        // Test cases
        {testCases}
      }
    }`,

    python: `
from typing import List    
{userCode}

if __name__ == "__main__":
    sol = Solution()
    # Test cases
    {testCases}
`,

    javascript: `
    {userCode}

    // Test cases
    {testCases}
    `,
  },
};

module.exports = problems;
