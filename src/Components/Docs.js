import React from 'react';

export const Docs = () => {
  return (
    <section className="container mx-auto px-4">
    <div className="mt-4 mb-2">
      <h1 className="text-3xl font-black">Hi, Senthil!</h1>
      <p className="mt-4 mb-2 font-light">Thank you so much for taking a moment to check out this small feature/widget I put together.
        The reason I did this for our call was to really drive home how my background as a fleet manager
        makes me a compelling engineering candidate for Fleetio. I'd love to take a few minutes to walk you through the code if we have time during our call today!
      </p>
      <h1 className="text-xl font-bold">About the feature</h1>
      <p className="mt-2 font-light">
        After brainstorming on a few ideas, I decided on a "Vendor Report Card" feature. The criteria for my
        decision to do this was:
      </p>
      <div className="mt-4 mb-2 ml-4">
        <li>Not already implemented in Fleetio</li>
        <li>Something I personally would have loved to see as a fleet manager</li>
        <li>Fit in with the rest of the Fleetio UI</li>
      </div>
     
    </div>
    <div className="mt-4 mb-2">
      <h1 className="text-xl font-bold">How it works</h1>
      <p className="mt-4 mb-2 font-light">
        In a nutshell, the Vendor Report Card will average out a service locations (RoE%) rate of efficiency
        by determining the following:
      </p>
      <div className="mt-4 mb-2 ml-4 font-light">
        <li><b>Shop Hours:</b> When they can work on your vehicle (src: Google Places API/GMB Hours)</li>
        <li><b>Book Hours:</b> The service entries manufacturers suggested book time (manually input dummy data for now, but it looks like the Motor Driven API has manufacturer suggested book times)</li>
        <li><b>Actual Time Repair Took:</b> The total time (less the non-workable off hours) that the shop had the vehicle in service</li>
      </div>
      <p className="mt-4 font-light">
        The Letter Grade on the component is calculated on three repairs sourced from my Fleetio trial account. The book hours(service entries) and shop hours(vendors) data are stored as custom fields on there respective entities.
      </p>
      <p className="mt-4 font-light">To see the feature in action, select "Firestone Complete Auto Care" from the dropdown below.</p>
    </div>
    <p className="mt-4 font-light"><p className="font-black">NOTE:</p> Due to the time it took to seed the dummy data, I only pre-populated Firestone for the purposes of this demo. All data is live and sourced from my Fleetio trial account.</p>
    </section>
  )
};