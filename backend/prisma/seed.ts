import { PrismaClient, Role, TopicCategory, QuestionType, ApplicationStatus } from '@prisma/client';
import { DSA_SHEET } from './data/dsa-sheet';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Users (Admin, Recruiter, Candidate)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@jobportal.dev' },
    update: {},
    create: {
      clerkId: 'user_admin_mock_123',
      email: 'admin@jobportal.dev',
      name: 'System Administrator',
      role: Role.ADMIN,
    },
  });

  const recruiterUser = await prisma.user.upsert({
    where: { email: 'recruiter@google.com' },
    update: {},
    create: {
      clerkId: 'user_recruiter_mock_456',
      email: 'recruiter@google.com',
      name: 'Sarah Connor',
      role: Role.RECRUITER,
    },
  });

  const candidateUser = await prisma.user.upsert({
    where: { email: 'candidate@example.com' },
    update: {},
    create: {
      clerkId: 'user_candidate_mock_789',
      email: 'candidate@example.com',
      name: 'Alex Johnson',
      role: Role.USER,
      profile: {
        create: {
          phone: '+1 555-0199',
          college: 'National Institute of Technology',
          skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Python'],
          location: 'San Francisco, CA / Bengaluru, IN',
          experience: '1 year full-time SDE',
        },
      },
    },
  });

  console.log('✅ Seeded users (Admin, Recruiter, Candidate)');

  // 2. Seed Companies
  const googleCompany = await prisma.company.upsert({
    where: { id: 'comp-google' },
    update: {},
    create: {
      id: 'comp-google',
      name: 'Google',
      logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&q=80',
      website: 'https://careers.google.com',
      description: 'Organizing the world’s information and making it universally accessible and useful.',
      recruiterId: recruiterUser.id,
      isApproved: true,
    },
  });

  const amazonCompany = await prisma.company.upsert({
    where: { id: 'comp-amazon' },
    update: {},
    create: {
      id: 'comp-amazon',
      name: 'Amazon',
      logoUrl: 'https://images.unsplash.com/photo-1523474255658-4af61825044d?w=128&q=80',
      website: 'https://amazon.jobs',
      description: 'Earth’s most customer-centric company, provider of AWS cloud and global e-commerce.',
      recruiterId: recruiterUser.id,
      isApproved: true,
    },
  });

  const msftCompany = await prisma.company.upsert({
    where: { id: 'comp-msft' },
    update: {},
    create: {
      id: 'comp-msft',
      name: 'Microsoft',
      logoUrl: 'https://images.unsplash.com/photo-1583339824000-5af72d41a54b?w=128&q=80',
      website: 'https://careers.microsoft.com',
      description: 'Empowering every person and organization on the planet to achieve more.',
      recruiterId: recruiterUser.id,
      isApproved: true,
    },
  });

  console.log('✅ Seeded companies');

  // 3. Seed Jobs
  const job1 = await prisma.job.upsert({
    where: { id: 'job-1' },
    update: {},
    create: {
      id: 'job-1',
      title: 'Software Development Engineer - I (Backend)',
      description: 'Join Google Core Infrastructure engineering team building high-throughput, low-latency microservices that power billions of daily search and cloud operations.',
      location: 'Bengaluru, India / Hybrid',
      jobType: 'FULL_TIME',
      salaryMin: 2400000,
      salaryMax: 3800000,
      skills: ['Go', 'Distributed Systems', 'C++', 'gRPC', 'Kubernetes'],
      experienceLevel: 'Fresher',
      status: 'OPEN',
      companyId: googleCompany.id,
      postedById: recruiterUser.id,
    },
  });

  const job2 = await prisma.job.upsert({
    where: { id: 'job-2' },
    update: {},
    create: {
      id: 'job-2',
      title: 'SDE-1 (Frontend & Web Systems)',
      description: 'Work on Amazon Prime Video and Retail shopping web experiences serving millions of concurrent global shoppers.',
      location: 'Hyderabad, India / Remote',
      jobType: 'FULL_TIME',
      salaryMin: 2200000,
      salaryMax: 3200000,
      skills: ['React', 'TypeScript', 'Next.js', 'Web Performance', 'GraphQL'],
      experienceLevel: 'Fresher',
      status: 'OPEN',
      companyId: amazonCompany.id,
      postedById: recruiterUser.id,
    },
  });

  const job3 = await prisma.job.upsert({
    where: { id: 'job-3' },
    update: {},
    create: {
      id: 'job-3',
      title: 'Cloud Solutions Engineer (Azure)',
      description: 'Architect and scale enterprise cloud solutions on Microsoft Azure. Collaborate with worldwide developers and enterprise partners.',
      location: 'Noida, India / Hybrid',
      jobType: 'FULL_TIME',
      salaryMin: 2000000,
      salaryMax: 3000000,
      skills: ['Azure', 'C#', '.NET', 'Docker', 'Terraform'],
      experienceLevel: 'Mid',
      status: 'OPEN',
      companyId: msftCompany.id,
      postedById: recruiterUser.id,
    },
  });

  // Seed sample application
  await prisma.application.upsert({
    where: { jobId_userId: { jobId: job1.id, userId: candidateUser.id } },
    update: {},
    create: {
      jobId: job1.id,
      userId: candidateUser.id,
      status: ApplicationStatus.UNDER_REVIEW,
      coverLetter: 'Passionate full stack developer with experience in distributed systems and cloud tooling.',
    },
  });

  console.log('✅ Seeded jobs and sample application');

  // 4. Seed Topics
  const aptTopic = await prisma.topic.upsert({
    where: { id: 'topic-apt-tsd' },
    update: {},
    create: {
      id: 'topic-apt-tsd',
      name: 'Time, Speed & Distance',
      category: TopicCategory.APTITUDE,
    },
  });

  const techTopicOS = await prisma.topic.upsert({
    where: { id: 'topic-tech-os' },
    update: {},
    create: {
      id: 'topic-tech-os',
      name: 'Operating Systems & Concurrency',
      category: TopicCategory.TECHNICAL,
    },
  });

  const hrTopicBehavioral = await prisma.topic.upsert({
    where: { id: 'topic-hr-star' },
    update: {},
    create: {
      id: 'topic-hr-star',
      name: 'Behavioral & STAR Method',
      category: TopicCategory.HR,
    },
  });

  console.log('✅ Seeded topics across Aptitude, DSA, Technical, and HR');

  // 5. Seed Notes
  await prisma.note.upsert({
    where: { id: 'note-tsd' },
    update: {},
    create: {
      id: 'note-tsd',
      topicId: aptTopic.id,
      title: 'Time, Speed & Distance Formula Cheat Sheet',
      content: `### High-Yield Equations
1. **Speed = Distance / Time**
2. **Unit Conversion**: 1 km/hr = 5/18 m/s ; 1 m/s = 18/5 km/hr
3. **Average Speed (Equal Distances)**: Avg Speed = 2 * S1 * S2 / (S1 + S2)
4. **Relative Speed**:
   - Same Direction: |S1 - S2|
   - Opposite Direction: S1 + S2
5. **Boats & Streams**:
   - Downstream Speed = u + v
   - Upstream Speed = u - v`,
    },
  });

  await prisma.note.upsert({
    where: { id: 'note-os' },
    update: {},
    create: {
      id: 'note-os',
      topicId: techTopicOS.id,
      title: 'Operating Systems: Deadlock & Virtual Memory',
      content: `### The 4 Coffman Deadlock Conditions
1. **Mutual Exclusion**: At least one resource must be non-shareable.
2. **Hold and Wait**: Process holds at least one resource and waits for another.
3. **No Preemption**: Resources cannot be preempted forcibly.
4. **Circular Wait**: A closed chain of processes each waiting for a resource held by the next.

### Virtual Memory & Paging
- **Page Table**: Translates virtual page numbers to physical frame numbers.
- **TLB (Translation Lookaside Buffer)**: High-speed hardware cache for page table lookups.
- **Thrashing**: High paging activity where system spends more time swapping pages than executing.`,
    },
  });

  console.log('✅ Seeded notes');

  // 6. Seed Questions
  const q1 = await prisma.question.upsert({
    where: { id: 'q-apt-1' },
    update: {},
    create: {
      id: 'q-apt-1',
      topicId: aptTopic.id,
      title: 'Train Crossing Platform Speed Problem',
      body: 'A train 240 meters long passes a telegraph pole in 16 seconds. How long will it take to pass a platform 420 meters long at the same speed?',
      type: QuestionType.MCQ,
      difficulty: 'Easy',
      options: ['28 seconds', '44 seconds', '36 seconds', '40 seconds'],
      answer: '44 seconds',
      explanation: '1) Speed = 240m / 16s = 15 m/s. 2) Total distance to pass platform = 240 + 420 = 660m. 3) Time = 660 / 15 = 44 seconds.',
    },
  });

  const q3 = await prisma.question.upsert({
    where: { id: 'q-tech-1' },
    update: {},
    create: {
      id: 'q-tech-1',
      topicId: techTopicOS.id,
      title: 'Deadlock Necessary Conditions',
      body: 'Which of the following is NOT one of the 4 Coffman conditions required for a deadlock to occur?',
      type: QuestionType.MCQ,
      difficulty: 'Medium',
      options: ['Mutual Exclusion', 'Preemptive Scheduling', 'Hold and Wait', 'Circular Wait'],
      answer: 'Preemptive Scheduling',
      explanation: 'The four Coffman conditions are: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Preemptive scheduling actually prevents deadlocks.',
    },
  });

  console.log('✅ Seeded questions');

  // 6b. Seed the full DSA sheet (sections -> topics, problems -> questions)
  // Rich body/solution content is kept for the hand-authored problems; the
  // remaining problems carry their title, difficulty and primary pattern.
  const dsaSolutions: Record<
    number,
    { body: string; answer: string; explanation: string; links: string[] }
  > = {
    121: {
      body: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.',
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
    },
    127: {
      body: 'Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
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
    },
    128: {
      body: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize profit by choosing a single day to buy and a single day to sell in the future.',
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
    },
    328: {
      body: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
      answer: `def climbStairs(n: int) -> int:
    if n <= 2: return n
    first, second = 1, 2
    for _ in range(3, n + 1):
        first, second = second, first + second
    return second`,
      explanation:
        'Classic Fibonacci recurrence: ways(n) = ways(n-1) + ways(n-2). Space can be optimized to O(1) by maintaining two state variables.',
      links: ['https://leetcode.com/problems/climbing-stairs/'],
    },
    338: {
      body: 'Given integer array coins and target amount, return fewest number of coins that make up that amount. If impossible, return -1.',
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
    },
  };

  for (const section of DSA_SHEET) {
    const topicId = `topic-dsa-${section.key}`;
    await prisma.topic.upsert({
      where: { id: topicId },
      update: { name: section.name },
      create: { id: topicId, name: section.name, category: TopicCategory.DSA },
    });

    if (section.concepts.length > 0) {
      const content = section.concepts.map((c) => `- ${c}`).join('\n');
      await prisma.note.upsert({
        where: { id: `note-dsa-${section.key}` },
        update: { title: 'Concepts Covered', content },
        create: { id: `note-dsa-${section.key}`, topicId, title: 'Concepts Covered', content },
      });
    }
  }

  const dsaQuestions = DSA_SHEET.flatMap((section) =>
    section.problems.map((p) => {
      const detailed = dsaSolutions[p.n];
      return {
        id: `q-dsa-${p.n}`,
        topicId: `topic-dsa-${section.key}`,
        title: p.title,
        body: detailed?.body ?? `Practice problem: ${p.title}. Primary pattern: ${p.pattern}.`,
        type: QuestionType.CODING,
        difficulty: p.difficulty,
        pattern: p.pattern,
        answer: detailed?.answer ?? '',
        explanation: detailed?.explanation ?? null,
        links: detailed?.links ?? [],
      };
    })
  );

  await prisma.question.createMany({ data: dsaQuestions, skipDuplicates: true });

  console.log(
    `✅ Seeded DSA sheet: ${DSA_SHEET.length} topics, ${dsaQuestions.length} problems`
  );

  // 7. Seed Quiz
  const sampleQuiz = await prisma.quiz.upsert({
    where: { id: 'quiz-speed-test' },
    update: {},
    create: {
      id: 'quiz-speed-test',
      title: 'Aptitude & Core CS Speed Challenge',
      topicId: aptTopic.id,
      duration: 15,
      difficulty: 'Medium',
    },
  });

  await prisma.quizQuestion.upsert({
    where: { quizId_questionId: { quizId: sampleQuiz.id, questionId: q1.id } },
    update: {},
    create: { quizId: sampleQuiz.id, questionId: q1.id },
  });

  await prisma.quizQuestion.upsert({
    where: { quizId_questionId: { quizId: sampleQuiz.id, questionId: q3.id } },
    update: {},
    create: { quizId: sampleQuiz.id, questionId: q3.id },
  });

  console.log('✅ Seeded quiz and questions mapping');

  // 8. Seed Company Guides
  await prisma.companyGuide.upsert({
    where: { slug: 'google' },
    update: {},
    create: {
      companyName: 'Google',
      slug: 'google',
      hiringProcess: 'Google software engineering recruitment evaluates coding proficiency, algorithmic optimization, distributed systems fundamentals, and Googleyness & Leadership.',
      rounds: [
        { name: 'Online Coding Assessment (OA)', duration: '90 Mins', focus: '2 Algorithmic Questions on HackerEarth/Internal Platform' },
        { name: 'Technical Phone Screen', duration: '45 Mins', focus: 'Live coding on Google Docs / CoderPad. Focus on clean code and communication.' },
        { name: 'Onsite / Virtual Loop (4-5 Rounds)', duration: '45 Mins Each', focus: '3-4 DSA/Coding rounds + 1 Googleyness & Leadership round' },
      ],
      tips: [
        'Always clarify constraints and edge cases before writing code.',
        'State your brute-force approach first, then optimize time/space complexity.',
        'Dry run your solution with a sample input before declaring you are done.',
      ],
      commonQuestions: [
        { title: 'Merge Intervals', difficulty: 'Medium', topic: 'Arrays' },
        { title: 'Course Schedule II', difficulty: 'Medium', topic: 'Graph / Topological Sort' },
        { title: 'Word Ladder', difficulty: 'Hard', topic: 'BFS / Shortest Path' },
      ],
    },
  });

  await prisma.companyGuide.upsert({
    where: { slug: 'amazon' },
    update: {},
    create: {
      companyName: 'Amazon',
      slug: 'amazon',
      hiringProcess: 'Amazon places heavy emphasis on the 16 Leadership Principles alongside strong algorithmic problem-solving and Object-Oriented Design.',
      rounds: [
        { name: 'Online Assessment 1 (Code Debugging & Coding)', duration: '90 Mins', focus: '2 Coding questions + Work Style assessment' },
        { name: 'Technical Phone Screen', duration: '60 Mins', focus: 'DSA coding problem + 20 mins of Leadership Principle behavioral questions' },
        { name: 'The Bar Raiser Onsite Loop (4 Rounds)', duration: '60 Mins Each', focus: 'Deep dive into LP questions using STAR method + live coding' },
      ],
      tips: [
        'Prepare 2-3 stories for every Amazon Leadership Principle.',
        'Use the STAR method (Situation, Task, Action, Result) with quantified metrics.',
      ],
      commonQuestions: [
        { title: 'LRU Cache', difficulty: 'Medium', topic: 'Design / Doubly Linked List' },
        { title: 'Number of Islands', difficulty: 'Medium', topic: 'DFS / BFS' },
        { title: 'Reorganize String', difficulty: 'Medium', topic: 'Heap / Greedy' },
      ],
    },
  });

  console.log('✅ Seeded company hiring guides');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
