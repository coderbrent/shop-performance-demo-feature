#Shop Performance Feature (Demo - Fleetio)
Built with React, Tailwind, Node, Express

#Objective:

As a fleet manager for a business that outsources their maintenance and repair work to more than one shop, you’ll often find yourself simply guessing when it comes to how well your vendors are performing for you. By leveraging some existing Fleetio data and combining it with some new data points, we are able to gain some valuable insight into these partnerships. Why is it important to know how well your shops are performing?
 
- It can help you negotiate better rates with them (helpful for labor contract renewals).
- It can promote an increase in overall fleet uptime by delegating jobs more effectively to better shops.
- It can help you shed poorly performing shops (makes “breaking up” easier to do when you can show them the performance gap).

#How does it help Fleetio?:

- I’m assuming a large portion of Fleetio's client base are small fleets (10 - 30 units). Generally, smaller outfits tend to outsource their maintenance and repair work to local shops and chains. That makes this feature attractive to the majority of existing Fleetio customers. 

- A feature like this would be very attractive to potential customers, making it a strong selling point to add to the already wide array of features that make Fleetio such an incredible piece of software.

#KPIs:
I've identified some KPIs for *vendor service shops*. This type of vendor (in Fleetio) performs work on site (as opposed to fueling only/parts only). These are your Tire shops, Transmission shops, general mechanic shops, etc.

- Efficiency - A service vendor's efficiency can either make or break a fleet based business. That is why it's such an important metric to follow. Many fleet managers will compare one shop to another, ie. "Joe's Auto Body always seems to get us back on the road faster than the local Maaco". Personally,I believe this to be a poor way to judge a shops efficiency. I think a more accurate way is to compare a shops actual time vs. book time performance on a job by job basis. That will be the metric this demo focuses on.

    Things/Edge cases I considered in this demo:
    
    - Off hours: Obviously a shop's efficiency rating should *not* be penalized for not performing work when they are closed or off. With that in mind - and because Fleetio doesn't provide a "shop hours" field on vendors, I created a "mini" feature in Node that, with the help of the Google Places API and some existing Fleetio data, fetches the shops operating hours and stores them as a custom text field on the vendor. With this feature, the vendors "hours" can then be checked to properly determine when they **can** actually work on vehicles!

    - Waiting for parts: Lots of variables can affect a shops efficiency, but waiting on parts is perhaps the most impactful, since it will likely eat into workable hours. In my own experience, while parts delays are a pain, the extended waits that really hurt are anomalies. Shops that always seem to be "waiting on parts" for extended lengths are likely telling you that to keep you off their case while they work on other customers cars. That said, it is something you can still measure through this feature.

    - Book hours: For the purposes of this demo, I simply created dummy service entries and added a custom "book hours" field for the given job. This "book hours" number is compared to the "actual" time (aka. the "workable" hours a shop had your car starting from the day it went in to the day it was completed), a rate is determined and later averaged out over all the given shops service entries. I did notice that Fleetio uses Motor Driven for OEM maintenance schedules - naturally I thought this would make for a really cool use of the API (they do appear to provide the standard book hours by the job). 


Other KPI's for a future implementation of the shop performance card (not included in this demo):

- Price - How competitive are the shops when considering their labor and part markup, distance from base, etc.?

- Service Issues - this is a broader category that covers the different types of errors a shop can make with your vehicles that result in returning for additional service (ie. Mechanic didn’t remove an old fuel filter gasket resulting in an oil leak and additional downtime/repairs). 
