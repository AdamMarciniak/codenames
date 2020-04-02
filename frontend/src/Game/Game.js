import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cookies from 'browser-cookies';
import useGameState from '../useGameState';
import api, { useApiCall } from '../api';
import Card from '../components/cards/Card';
import DrawBox from './DrawBox';


export const JoinGame = ({ match: { params } }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState(params.code || '');
  const [svg, setSvg] = useState(null);
  const joinGame = useApiCall('joinGame', { name, gameCode: code, svg: svg });
  return (
    <div className="form-wrap">
      <div className="form">
        <label>
          Real quick: what's your name?
          <input value={name} placeholder="Baby Yoda" onChange={e => setName(e.currentTarget.value)} />
        </label>
        {!params.code && (
          <label>
            Game Code
            <input value={code} placeholder="-----" onChange={e => setCode(e.currentTarget.value)} />
          </label>
        )}
        <p>Draw Yourself!</p>
        <DrawBox setSvg={setSvg}/>
        <button onClick={joinGame}>Join Game</button>
      </div>
    </div>
  )
}

export const CreateGame = () => {
  const [svg, setSvg] = useState(null);
  const [name, setName] = useState('');
  const createGame = useApiCall('createGame', { name, svg });

  return (
    <div className="form-wrap">
      <div className="form">
        <label>
          First - What's Your Name?
          <input value={name} placeholder="Baby Yoda" onChange={e => setName(e.currentTarget.value)} />
        </label>
        <p>Draw Yourself!</p>
        <DrawBox setSvg={setSvg}/>
        <button onClick={createGame}>Create Game</button>
      </div>
    </div>
  )
}

export const Menu = () => {
  return (
    <div className="form-wrap">
      <div className="form">
        <Link className="button" to='/join'>Join an existing game</Link>
        <Link className="button" to='/new'>Start a new game</Link>
      </div>
    </div>
  )
}

const RoleStatus = () => {
  const gameState = useGameState();
  if (!gameState) {
    return null;
  }
  const currentPlayer = gameState.players[gameState.currentPlayerId];
  const currentTeamCluegiver = Object.values(gameState.players).find(({ team, isCluegiver }) => team === currentPlayer.team && isCluegiver);
  if (currentPlayer.team === 'OBSERVER') {
    return <>You are <strong>Observing</strong>. Join a team to play!</>
  } else {
    let cluegiverLine;
    if (!currentTeamCluegiver) {
      cluegiverLine = <div>Your team doesn't have a cluegiver yet!</div>;
    } else if (currentTeamCluegiver == currentPlayer) {
      cluegiverLine = <div><strong>You are the cluegiver!</strong></div>;
    } else {
      cluegiverLine = <div>Your cluegiver is {currentTeamCluegiver.name}</div>;
    }

    return (
      <>
        <div>You are on team <strong style={{ color: currentPlayer.team.toLowerCase() }}>{currentPlayer.team}</strong>.</div>
        {cluegiverLine}
      </>
    );
  }
}



const TeamDisplay = props => (
  <div className="team-display" style={{border: `${props.color} solid 3px`}}>
    {
      Object.keys(props.gameState.players).
        filter(id =>
          props.gameState.players[id].team === props.team
        ).map(id => (
          <Player
            player={props.gameState.players[id]}
            svgId={props.gameState.svgs.filter(item => item.player_id == id)[0]['id']}
            key={id}/>
          )
        )
    }
  </div>
)

const Player = props => (
  <div className='player'>
    <div className='player-name'
         style={{color: props.player.team === 'BLUE' ? '#34BAEB' : '#DE6228',
                border: props.player.isCluegiver ? 'solid 3px gold' : 'none' }}>
      {props.player.name}
    </div>
    <PlayerSVG id={props.svgId}/>
  </div>
)

const PlayerSVG = props => {
  const getSvg = useApiCall('getSvg', { id: props.id });
  const [svg, setSvg] = useState(null);
  console.log(props.id);
  useEffect(() => {
    getSvg().then(result => {setSvg(result)})

  },[props.id,setSvg])

  return (
    <div  style={{width:'100%',
                  height:'auto',
                  overflow: 'hidden',
      }}>
    <svg  width='100%' viewBox={'0 0 348 198'} preserveAspectRatio="xMidYMid meet">
      <g dangerouslySetInnerHTML={{__html:svg }}>
      </g>
    </svg>
    </div>
  )
}

const PlayersReadout = props => {
  return (
    <div className="players-readout">
      <TeamDisplay color={'#34BAEB'} team="BLUE" gameState={props.gameState}/>
      <TeamDisplay color={'#DE6228'} team="RED" gameState={props.gameState}/>
    </div>
  )
}

export default () => {
  const gameState = useGameState();
  const endTurn = useApiCall('endTurn');
  const joinRedTeam = useApiCall('joinTeam', { team: 'RED' });
  const joinBlueTeam = useApiCall('joinTeam', { team: 'BLUE' });
  const becomeCluegiver = useApiCall('becomeCluegiver');
  const exitGame = useCallback(() => {
    cookies.erase('secret');
    window.location.href = '/'
  });

  if (!gameState) {
    return null;
  }
  const currentPlayer = gameState.players[gameState.currentPlayerId];
  const isCurrentPlayerTurn = gameState.currentTurn === currentPlayer.team;
  const teamHasCluegiver = Object.values(gameState.players).find(({ team, isCluegiver }) => team === currentPlayer.team && isCluegiver);
  const canEndTurn = isCurrentPlayerTurn && teamHasCluegiver && !currentPlayer.isCluegiver;
  const canClickCard = teamHasCluegiver && !currentPlayer.isCluegiver && isCurrentPlayerTurn;

  // you can join a team if you aren't already on one, or if you are but no cards have been flipped yet.
  const canJoinTeam = currentPlayer.team === 'OBSERVER' || (!gameState.words.find(({ flipped }) => flipped) && !currentPlayer.isCluegiver);


  return (
    <div className="game-wrap">
    <PlayersReadout gameState={gameState}/>
      <div className="card-wrap">
        {gameState.words.map((word) => (
          <Card
            key={word.id}
            word={word.text}
            type={word.type}
            flipped={word.flipped}
            clickable={canClickCard}
            onClick={() => canClickCard && api('revealWord', { wordId: word.id })}
          />
        ))}
      </div>
      <div className="control-bar">
        <div className="role-status">
          <RoleStatus />
        </div>
        <div className="buttons">
          {canEndTurn && <button onClick={endTurn} style={{ backgroundColor: 'black', color: 'white' }}>End Turn</button>}
          {
            currentPlayer.team !== 'OBSERVER' && !teamHasCluegiver && <button onClick={becomeCluegiver}>Become Cluegiver</button>
          }
          {
            canJoinTeam
              && currentPlayer.team !== 'RED'
              && (
                <button onClick={joinRedTeam} style={{ backgroundColor: '#FF7F6D' }}>
                  {currentPlayer.team === 'OBSERVER' ? 'Join' : 'Switch to'} Red Team
                </button>
              )
          }
          {
            canJoinTeam
              && currentPlayer.team !== 'BLUE'
              && (
                  <button onClick={joinBlueTeam} style={{ backgroundColor: '#6DD3FF' }}>
                  {currentPlayer.team === 'OBSERVER' ? 'Join' : 'Switch to'} Blue Team
                </button>
              )
          }
        </div>
      </div>
      <footer>
        <div>Invite your friends! <strong>{window.location.protocol}//{window.location.host}/join/{gameState.gameCode}</strong></div>
        <div onClick={exitGame} className="exit-button">Exit this Game</div>
      </footer>
    </div>
  )
}
