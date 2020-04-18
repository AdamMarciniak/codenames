import React, { useMemo, useCallback } from "react";
import './PlayerSection.css';
import { copyContents } from "./utils";
import PlayerAvatar from "./PlayerAvatar";
import useGameState from '../useGameState';
import cx from 'classnames';
import { getPlayer, getCurrentPlayer, getTeamPlayers, getCanSwitchTeams } from "../gameStateSelectors";
import { useApiCall } from "../api";
import cookies from 'browser-cookies';

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
  const canSwitchTeams = getCanSwitchTeams(gameState);
  const [joinTeam, joiningTeam] = useApiCall('joinTeam', { team });
  const [becomeCluegiver, becomingCluegiver] = useApiCall('becomeCluegiver');
  const players = useMemo(() => {
    const allPlayers = getTeamPlayers(gameState, team);
    return [
      allPlayers.find(({ isCluegiver }) => isCluegiver),
      ...allPlayers.filter(({ isCluegiver }) => !isCluegiver)
    ].filter(Boolean);
  }, [gameState, team]);
  const hasCluegiver = !!players.find(({ isCluegiver }) => isCluegiver);
  const missingPlayers = 2 - players.length;
  return (
    <div className={cx('game-roster', { 'red-team': team === 'RED', 'blue-team': team === 'BLUE' })}>
      <h4 className="game-roster-team-name">{TEAM_NAMES[team]}</h4>
      {currentPlayer.team === team && <span className="game-team-annotation">(your team)</span>}
      {missingPlayers > 0 && <span className="game-team-annotation">Needs {missingPlayers} more player{missingPlayers === 1 ? '' : 's'}!</span>}
      {missingPlayers <= 0 && !hasCluegiver && <span className="game-team-annotation">Needs a Cluegiver!</span>}
      {players.map((player) => <Player id={player.id} key={player.id} />)}
      {currentPlayer.team !== team && canSwitchTeams && <button onClick={joinTeam} disabled={joiningTeam}>Join {TEAM_NAMES[team]}</button>}
      {currentPlayer.team === team && !hasCluegiver && <button onClick={becomeCluegiver} disabled={becomingCluegiver}>Become Cluegiver</button>}
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

const PlayerSection = ({ onClick }) => {
  const gameState = useGameState();

  const exitGame = useCallback(() => {
    cookies.erase("secret");
    window.location.href = "/";
  }, []);

  const [startNewGame, startingNewGame] = useApiCall('startNewGame');

  const code = gameState.roomCode;
  return (
    <aside className="game-players" onClick={onClick}>
      <RoomLink code={code} />
      {['RED', 'BLUE'].map((team) => <Roster team={team} key={team} />)}
      <div className="game-control-wrapper">
        <button onClick={exitGame} className="game-exit-button">Leave Game</button>
        <button onClick={startNewGame} className="game-new-button" disabled={startingNewGame}>End &amp; Start New</button>
      </div>
    </aside>
  );
}

export default PlayerSection;
