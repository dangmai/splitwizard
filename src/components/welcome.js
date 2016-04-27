import React from 'react';

const Welcome = () => (
  <div className="welcome row">
      <div className="col-md-6">
        <h2 className="text-center">What?</h2>
        <p className="text-center">
          A Wizard never oversplits the bill, nor undersplits.
          <br />
          He splits them precisely where he wants to.
        </p>
      </div>
      <div className="col-md-6">
        <h2 className="text-center">Seriously, what?</h2>
        <p className="text-center">
          Split Wizard helps Mortal Men split their bills wisely among their fellowship.
          <br />
          Particularly when some of them get captured by the Dark Lord in the middle of a billing cyle.
        </p>
      </div>
  </div>
);

export default Welcome;