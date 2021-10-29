import React from "react";
import { Link } from "react-router-dom";
import SquigglyText from "../components/SquigglyText";

const Menu = () => {
  return (
    <div className="menu-wrap">
      <SquigglyText>Those.Codes</SquigglyText>
    <p>Back For a Limited Time Only.<p>
      <p style={{margin: '0 10px 30px 10px',textAlign:'center', color:'grey'}}> Needs at least 4 players.</p>
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
