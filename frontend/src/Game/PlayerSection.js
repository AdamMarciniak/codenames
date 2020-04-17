import React, { useMemo, useCallback } from "react";
import './PlayerSection.css';
import { copyContents } from "./utils";
import PlayerAvatar from "./PlayerAvatar";
import useGameState from '../useGameState';
import cx from 'classnames';
import { getPlayer, getCurrentPlayer, getTeamPlayers } from "../gameStateSelectors";

const TEAM_NAMES = {
  RED: 'Red Team',
  BLUE: 'Blue Team'
};

const Player = ({ id }) => {
  const gameState = useGameState();
  const { name, isCluegiver } = getPlayer(gameState, id);
  return (
    <div className="player">
      {isCluegiver && <><img className="player-avatar-crown" src={require('./crown.svg')} /><span className="player-cluegiver-annotation">Cluegiver</span></>}
      <PlayerAvatar id={id} />
      <h5 className="player-name">{name}</h5>
    </div>
  )
}

const Roster = ({ team }) => {
  const gameState = useGameState();
  const currentPlayer = getCurrentPlayer(gameState);
  const players = useMemo(() => {
    const allPlayers = getTeamPlayers(gameState, team);
    return [
      allPlayers.find(({ isCluegiver }) => isCluegiver),
      ...allPlayers.filter(({ isCluegiver }) => !isCluegiver)
    ];
  }, [gameState, team]);
  return (
    <div className={cx('game-roster', { 'red-team': team === 'RED', 'blue-team': team === 'BLUE' })}>
      <h4 className="game-roster-team-name">{TEAM_NAMES[team]}</h4>
      {currentPlayer.team === team && <span className="game-your-team-annotation">(your team)</span>}
      {players.map((player) => <Player id={player.id} key={player.id} />)}
    </div>
  )
}

const RoomLink = ({ code }) => {
  const link = useMemo(() => `${window.location.host}/game/${code}`, [code]);
  const copyLink = useCallback(() => copyContents(link), [link]);

  return (
    <button className="game-room-link" onClick={copyLink}>
      <span className="game-room-link-url">{link}</span>
      <span className="game-room-link-instruction">Click to copy!</span>
    </button>
  )
}

const PlayerSection = () => {
  const gameState = useGameState();
  const currentPlayer = getCurrentPlayer(gameState);
  const teamOrder = currentPlayer.team === 'OBSERVER' ? ['RED', 'BLUE'] : [currentPlayer.team, ['RED', 'BLUE'].find((x) => x !== currentPlayer.team)];

  const code = "asdf";
  return (
    <aside className="game-players">
      <RoomLink code={code} />
      {teamOrder.map((team) => <Roster team={team} key={team} />)}
    </aside>
  );
}

export default PlayerSection;
