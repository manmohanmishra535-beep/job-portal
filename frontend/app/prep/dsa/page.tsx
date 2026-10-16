'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Code2, ArrowLeft } from 'lucide-react';
import DsaTopicSheet from '@/components/DsaTopicSheet';
import { Question } from '@/types';

const DSA_CATEGORIES: { id: string; name: string; questions: Question[] }[] = [
  {
    id: 'arrays',
    name: 'Arrays & Two Pointers',
    questions: [
      {
        id: 'q-dsa-1',
        topicId: 'topic-dsa-arrays',
        title: 'Two Sum',
        body: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.',
        type: 'CODING',
        difficulty: 'Easy',
        answer: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        explanation:
          'Utilize a hash map to look up the complement in O(1) time complexity. Single pass yields O(N) time and O(N) space.',
        links: ['https://leetcode.com/problems/two-sum/'],
        progressStatus: 'NOT_STARTED',
      },
      {
        id: 'q-dsa-2',
        topicId: 'topic-dsa-arrays',
        title: 'Best Time to Buy and Sell Stock',
        body: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize profit by choosing a single day to buy and a single day to sell in the future.',
        type: 'CODING',
        difficulty: 'Easy',
        answer: `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit`,
        explanation:
          'Track the running minimum price and calculate potential profit on each subsequent day. Time: O(N), Space: O(1).',
        links: ['https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'],
        progressStatus: 'NOT_STARTED',
      },
      {
        id: 'q-dsa-3',
        topicId: 'topic-dsa-arrays',
        title: "3Sum (Zero Triplet Sum)",
        body: 'Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
        type: 'CODING',
        difficulty: 'Medium',
        answer: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0: l += 1
            elif s > 0: r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l+1]: l += 1
                while l < r and nums[r] == nums[r-1]: r -= 1
                l += 1; r -= 1
    return res`,
        explanation:
          'Sort the array first. Fix one element and run two pointers (left and right) on the remaining array. Skip adjacent duplicate elements to avoid redundant triplets.',
        links: ['https://leetcode.com/problems/3sum/'],
        progressStatus: 'NOT_STARTED',
      },
    ],
  },
  {
    id: 'dp',
    name: 'Dynamic Programming & Memoization',
    questions: [
      {
        id: 'q-dsa-4',
        topicId: 'topic-dsa-dp',
        title: 'Climbing Stairs',
        body: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        type: 'CODING',
        difficulty: 'Easy',
        answer: `def climbStairs(n: int) -> int:
    if n <= 2: return n
    first, second = 1, 2
    for _ in range(3, n + 1):
        first, second = second, first + second
    return second`,
        explanation:
          'Classic Fibonacci recurrence: ways(n) = ways(n-1) + ways(n-2). Space can be optimized to O(1) by maintaining two state variables.',
        links: ['https://leetcode.com/problems/climbing-stairs/'],
        progressStatus: 'NOT_STARTED',
      },
      {
        id: 'q-dsa-5',
        topicId: 'topic-dsa-dp',
        title: 'Coin Change (Fewest Coins)',
        body: 'Given integer array coins and target amount, return fewest number of coins that make up that amount. If impossible, return -1.',
        type: 'CODING',
        difficulty: 'Medium',
        answer: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
        explanation:
          'Unbounded knapsack style 1D DP table where dp[i] represents minimum coins required for sum i. Time: O(amount * len(coins)).',
        links: ['https://leetcode.com/problems/coin-change/'],
        progressStatus: 'NOT_STARTED',
      },
    ],
  },
];

export default function DsaPage() {
  const [selectedCat, setSelectedCat] = useState(DSA_CATEGORIES[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/prep"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Prep Hub
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <Code2 className="w-4 h-4" />
          Technical Coding Tracks
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Dedicated DSA Topic Sheet
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Curated problem sets categorized by fundamental pattern. Track solved state, inspect time/space complexities, and view idiomatic solutions.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10">
        {DSA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCat.id === cat.id
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25'
                : 'glass-panel text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Topic Sheet Component */}
      <DsaTopicSheet topicName={selectedCat.name} questions={selectedCat.questions} />
    </div>
  );
}
