#Shop Performance Feature (Demo - Fleetio)
Built with React, Tailwind, Node, Express

##Who it’s for:
Any Fleetio user that outsources their work. In fact, the more work outsourced, the more impactful this feature is.

##Objective:

As a fleet manager for a small business that outsources their work to more than one shop, you’ll often find yourself simply guessing when it comes to how well your vendors are performing overall. In many cases, shops - which likely have far different management/employees/policies than your business - will become either your fleets greatest strength or most glaring weakness. Ultimately, as a fleet manager, you want to have as much clarity and control over a shop while at the same time maintaining a positive and cooperative relationship. By leveraging your existing Fleetio data, we are able to gain some valuable insight into this partnership. This information can help us:
 
- Negotiate better rates with vendors (labor contract renewals)
- Increase overall fleet uptime.
- Shed poorly performing shops (makes “breaking up” easier to do when you can show them the performance gap).

##How does it help Fleetio:
For starters, I’m assuming a large portion of their client base are small fleets (10 - 30 units). I believe this is something that this part of Fleetios customer base would use a lot. Additionally, a feature like this would be very attractive to potential customers as a selling feature with smaller fleets (of which, again, I will assume is the vast majority).

##KPIs:
I've identified some KPIs for vendor service shops. This type of vendor (in Fleetio) performs work on site (as opposed to fueling only/parts only). These are your Tire shops, Transmission shops, general mechanic shops, etc.

1. Speed/Efficiency - A vendor's speed can make or break your fleet based business. That is why it's so important to visualize (and not just guess) how well a shop is performing for you at an efficiency level. I believe that rather than comparing shops directly to one another, the best way to determine how well a shop is doing is to compare it's total job speed against a standard "book time" speed. Most auto manufacturers supply shops with "book" times for the various repairs they have on their vehicles. For example, an engine job on a 2008 Toyota Camry may have a "book time" of 8 hours. This figure is used to not only determine how long the job SHOULD take, but how much a shop should pay a mechanic taking on that job.

    Things to consider:
    
    - Off hours: If we consider that most shops work Mon-Sat schedules (with varying operating hours) and take off Sundays, we have some variables that would need to be addressed to make our data more useful.

        - hours of operation: As a fleet manager, you know that dropping a vehicle off at 3:00pm on a Saturday for an A/C condenser/compressor means you will not have that vehicle back until at least some time Monday. How is our grading formula affected by this? We want to avoid penalizing a shop for poor speed/efficiency performance if a vehicle is dropped off right before they close (effectively hitting them with hours of "down time" that shouldn't degrade their performance).

        (shop_hours) > custom fields(dateTimeInput)

        function getTotalPossibleHoursWorked(service_entry:Object, shops_schedule:Object) {
            // we want to exclude the closed hours from each job so they do not affect the shops overall speed grade.

            let dropOffDayTotalHours = shops_schedule[close] - service_entry.droppedOffAt //--> 5pm - 3pm (2 workable hours)

            iterate over the schedule, grab each day, get the total hours by subtracting close to open, return that number to an array that contains the total WORKABLE hours for the day. sum up the total hours.
            
            Object.entries(shops_schedule).map(el => el[0] - el[1]).reduce((a, b) => a + b)

            let inShopTime = someDateUtilFunc(service_entry.droppedOffAt); //--> 3:00pm
            let totalWorkableHours = shopsScheduleOnDayOfJob - inShopTime; //--> 2 (hours)

            If a job that takes 8 possible work(book) hours ends up taking 26 possible work hours, the total rate of efficiency is 30% (8 / 26).

            This would be considered a POOR efficiency rate by most standards. While things like part availability/delivery issues are factors that can fall out of control for mechanics, when averaging out over the course of a given period of jobs, this data should provide a clearer picture as to who is actually performing and who is always "waiting on the parts". The key is using the book data to determine what IS a large job and what is NOT. The book time for a job ultimately does the heavy lifting here for the data, as it takes into consideration the overall difficulty of jobs when determining a time. Naturally, an engine swap is going to take longer than an oil change! But if a shop keeps your car for 3 days to do an .25 hour oil change, there's obviously an efficiency issue!

        }

ex. service_entry
        transmission_job = {
            droppedOffAt: `11/23/20 : 3:00pm`, //--> shop closes at 5pm, so 2 hours of possible work time
            completedAt: `11/26/20 : 3:00pm`, //--> 
            totalHours: droppedOffAt + pickedUpAt, // --> 72
            bookHours: `8` <- set by system (or admin),
            actualHours: `72` <- when we calc this, we EXCLUDE closed hours,
            diff: `(actualHours - bookHours)` <- can be a negative or positive int.
        }

ex. shops_schedule
            
            {
                monday: 9 - 5,
                tuesday: 9 - 5, 
                wednesday: 9 - 5,
                thursday: 9 - 5,
                friday: 9 - 5,
                saturday: 8 - 6,
                sunday: off
            }

        if drop off time =< shop_hours_close

        (actual_time)
        (book_time)
        (shop_speed = actual_time - book_time)
        
        ** New Feature idea: have a real-time "shop queue/schedule" that a participating shop can use to indicate what their workload is so you know when the best time is to bring a vehicle!

    * Note: While at first it seemed to be an attractive (and easy to obtain) metric to observe, a shops `overall job downtime` is a poor performance metric and should NOT be considered for a variety of reasons. For one, outsourced shops do not all handle the same type of work, therefore downtime comparisons would not yield any useful data. 
    
    For example, a transmission shop will return far greater downtime figures than a shop that primarily handles oil changes or more general work. While it may be an interesting exercise to compare shop downtime performance by type (ie. how do my transmission shops stack against each other?) I felt this was beyond the scope of this feature, given that it is only a demo.



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
