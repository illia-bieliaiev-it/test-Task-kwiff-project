# Test task for Kwiff project

## 1. Description
## AsyncAwait

## Accumalators
Accumalator bets are a popular product around the world! You can increase your odds by betting on two things happening.
When you do this, the odds are multiplied together
E.G.
- England win vs. France, odds of 2
- England win vs. Germany, odds of 3
- Total odds, 6

## Validation
When a user places a bet on an outcome, we need to do the following tasks before we can accept the bet
- Decided whether or not the user is able to bet (they might have no money!)
- Get the odds for each outcome
- Decide whether the business is happy to accept each odd individually (the risk)
- Calculate the accumalator odds
- Decide whether the business is happy to accept the accumalated odds (the total risk)

This requires multiple calls to various services; each has a latency. We want to minimise this latency.

## Task
- We have somee sample code in `Validator.ts`.
- We have a test suite in `Validator.spec.ts`. All the tests pass.
- We have some mock services in `API.ts`. Each service has a mock latency.
    - You may not modify the `API.ts`. Think of them as an external provider.
- You must reduce the latency to as low as possible. `Node.js` is an ideal langauge for this task!
    - Start off by extimating how long each test will take to run. Can you predict it?


## 2. Task Solution

To estimate the time taken for the given function to run, we need to understand the latency introduced by each API call and the order of these calls.

Let's break it down step-by-step:

### 1. validateUserRisk:

The latency is 0.1 seconds. This is a one-time call.

### 2. getOutcomeOdds: 

The latency is 0.1 seconds. The call is made in a loop for each outcome ID. If we assume there are N outcome IDs, the total latency introduced by this loop will be N * 0.1 seconds.

### 3. validateOdd: 

The latency is 0.1 seconds. The call is made in a loop for each odd. Again, if there are N odds, the total latency introduced by this loop is N * 0.1 seconds.

### 4.validateAccumalatorRisk 

The latency is 0.1 seconds. This is a one-time call.

Given these details, the total latency, T, introduced by the current implementation for N outcomes/odds can be calculated as:

### T = 0.1 + N × 0.1 + N × 0.1 + 0.1

### T = 0.3 + 0.2 x N

For example, if there are 5 outcomes (N = 5), the total latency is:

### T = 0.3 + 0.2 x 0.5 = 1.3 seconds

However, this is a suboptimal implementation. We can optimize it by taking advantage of the asynchronous nature of Node.js. 

Optimized implementation is in the Optimized.ts file.


# For Discussion
## Solution related to SportUpdateArchitecture.md

It could be architecture design using AWS services, one of the most popular cloud providers:

### API Gateway:
- Handle incoming HTTP requests from the 3rd party provider.
- Provide rate limiting and DDoS protection.

### AWS Lambda:
- Serverless function to process incoming messages.
- Can differentiate between Event updates and Odds updates, and process them accordingly.

### Amazon Kinesis (or Amazon SQS for simpler queueing needs):
- Acts as a buffer for incoming messages to ensure that there's no loss of data during high load and to decouple processing from ingestion.
- Can handle large bursts of incoming messages and process them in the order they arrived.

### AWS Lambda (Data Processing Lambda):
- Triggered by Kinesis or SQS to process and store messages in a database.
- Can handle the data transformation and any business logic before storing it.

### Amazon RDS (or Amazon DynamoDB):
- **RDS**: For relational database storage which is suitable for structured data and complex queries. Especially useful if the data has relations such as events, teams, players, etc.
- **DynamoDB**: For NoSQL storage which is suitable for high write and read throughputs with simpler data structures.

### Amazon CloudWatch:
- For monitoring, logging, and setting up alerts.

### IAM (Identity and Access Management):
- For setting up permissions and roles for each service, ensuring that only authorized services/individuals can access the data and services.

### Flow:

1. The 3rd party provider sends an HTTP request to the API Gateway.
2. API Gateway forwards the request to the initial AWS Lambda.
3. Lambda parses the message and sends it to Kinesis or SQS for temporary storage and order preservation.
4. A second Lambda (Data Processing Lambda) is triggered by Kinesis/SQS to process and store the message in RDS or DynamoDB.
5. Client applications can then query the database (RDS/DynamoDB) to fetch the required updates/information.

### Considerations:

1. Ensure data privacy and security compliance, especially if dealing with personal data or sensitive information.
2. Regularly backup the RDS database to S3 and set up Multi-AZ deployment for high availability.
3. Optimize Lambda functions for performance and cost.
4. For very high throughput, consider using Kinesis Data Firehose for direct insertion into databases after some potential Lambda processing.
5. Regularly monitor and set up alerts using CloudWatch to detect and address any anomalies or issues.


This architecture provides a scalable, robust, and cost-effective solution for handling sport updates from a third-party provider.

## Solution related to Databases.md

The two functions essentially serve the same purpose: they both aim to either update an existing record or insert 
a new one if it doesn't exist. However, the way they achieve this goal is different. Let's break down the differences:

### myDbFunc:

1. It uses the INSERT ... ON DUPLICATE KEY UPDATE syntax.
2. In a single SQL query, it tries to insert a new record, and if there's a duplicate key (i.e., a conflict because the record with the specified ID already exists), it updates the existing record.

### Advantages of myDbFunc:
- Only one trip to the database is needed, which can be more efficient in terms of latency and bandwidth.
- Less code to write and, therefore, easier to maintain and understand.

### myOtherDbFunc:
1. It first tries to update an existing record based on the ID.
2. If no records were updated (i.e., the record with the specified ID doesn't exist), it inserts a new record.
3. This function uses two separate SQL queries to achieve this.

### Advantages of myOtherDbFunc:

- The "UPDATE ... RETURNING *" syntax can return the updated rows (if the database system supports this syntax). This can be useful if you want to check the result of the update.
- It's more explicit about the intention: first, try to update, and if that doesn't work, then insert.


### Which One is Better?
### Efficiency: 
In terms of efficiency, myDbFunc is typically better because it makes a single round-trip to the database, while myOtherDbFunc might need two in the case where the record doesn't exist. Reducing database round-trips can lead to better performance, especially when dealing with remote databases.

### Clarity: 
myOtherDbFunc is more explicit in its approach, which can sometimes make it easier to understand the intention behind the code.

### Compatibility: 
The INSERT ... ON DUPLICATE KEY UPDATE syntax is specific to MySQL and might not be supported in other database systems. On the other hand, the two-query approach of myOtherDbFunc can be adapted to various databases, but the "RETURNING" clause is specific to some databases like PostgreSQL.

### SQL Injection Vulnerability: 
Both functions, as presented, are potentially vulnerable to SQL injection because they insert data directly into the SQL strings. This is a major security concern. Ideally, you'd use parameterized queries or prepared statements to safely insert data into SQL queries.

In conclusion, while myDbFunc is more efficient, choosing the best approach also depends on the database system you're using, your specific requirements, and ensuring that you handle data safely to prevent SQL injection.