import React from "react";
import { Link } from "react-router-dom";
import SquigglyText from "../components/SquigglyText";

const Menu = () => {
  return (
    <div className="menu-wrap">
      <SquigglyText>Those.Codes</SquigglyText>
      <div className="form-wrap">
        <div className="form">
          <Link className="button new" to="/new">
            Start a new game
          </Link>
          <Link className="button join" to="/join">
            Join an existing game
          </Link>
          <Link className="button gallery" to="/gallery">
            Avatar Gallery (Warning: NSFW)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
