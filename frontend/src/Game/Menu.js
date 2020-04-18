import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="form-wrap">
      <div className="form">
        <Link className="button new" to="/new">
          Start a new game
        </Link>
        <Link className="button join" to="/join">
          Join an existing game
        </Link>
      </div>
    </div>
  );
};

export default Menu;
