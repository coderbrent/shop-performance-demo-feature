Shop Performance Feature (Demo)
Built in React, Tailwind

Who it’s for:
Any Fleetio user that outsources their work. The more work outsourced, the more impactful.

How does it help Fleetio:
I’m assuming a large portion of their client base are small fleets (10 - 30 units). A feature like this can be very attractive to this portion of the clientele since it is far more likely a smaller base is outsourcing (no mechanic on site)

Objective:

As a fleet manager for a small business that outsources their work to more than one shop, you’ll often find yourself comparing the performance of these entities to one another when determining who handles your work the best. Often times, shops (having different management/employees/policies) can become your fleets greatest strength or biggest weakness. Ultimately, as a fleet manager, you want to have as much clarity and control over a shop while maintaining a positive and cooperative relationship. This can be achieved by gaining a deeper insight into collected/shared data:

Having a clearer picture as to which shop does the “best job” at handling your fleet can help you:
 
- Negotiate better rates with vendors (labor contract renewals)
- Increase overall fleet uptime
- Shed poorly performing shops (makes “breaking up” easier to do when you can show them the performance gap).

KPIs:

So what are the KPI’s generally for shops?

1. Speed - How long are your vehicles down for servicing from the time they  enter the shop to the time they leave? This is especially important for smaller fleets.

1. Price - How competitive overall are the shops when considering their labor and part markup? 

1. Service Issues - this is a broad category that covers the different types of errors a shop can make with your vehicles that result in returning for additional service (ie. Mechanic didn’t remove an old fuel filter gasket resulting in an oil leak and additional downtime/repairs)

As with most 

How does that work with Fleetio API data?

Challenges:

How do you determine

1. A Shops speed can be determined by calculating:
    1. Time it takes to complete the given service task(s) + any additional “down time” (ie. waiting for parts/special orders, etc.)
    2. Endpoints for this data include: 
2. Pricing for labor and part markup 


How do we build this feature as a demo?

1. We need access to Fleetio API (need to pay for account)
2. We build a simple “widget” (a card component styled with tailwind) that displays a shop name - letter grade (will be determined by mean of overall metrics)
3. List of KPIs that generate the letter grade (total down time)
