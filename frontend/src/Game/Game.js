import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cookies from 'browser-cookies';
import useGameState from '../useGameState';
import api, { useApiCall } from '../api';
import Card from '../components/cards/Card';
import C2S from './canvasSvg.js'
import { socket } from '../api'


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
            <input value={code} placeholder="THFRC" onChange={e => setCode(e.currentTarget.value)} />
          </label>
        )}
        <p>Draw Yourself!</p>
        <AvatarCanvas setSvg={setSvg}/>
        <button onClick={joinGame}>Join Game</button>
      </div>
    </div>
  )
}



const AvatarCanvas = props => {
  const canvasRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [fakeCtx, setFakeCtx] = useState(null);
  const [rect, setRect] = useState(null);

  const handleMouseMove = useCallback(e => {
    if (isMouseDown) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
      fakeCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      fakeCtx.stroke();
      console.log(e.clientY);
    }
  },[ctx, isMouseDown, rect])

  useEffect(() => {

console.log(fakeCtx);
  },[fakeCtx])

  const handleMouseDown = useCallback(e => {
    setIsMouseDown(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    fakeCtx.beginPath();
    fakeCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = 10;
    fakeCtx.lineWidth = 10;

  },[setIsMouseDown, ctx, rect])

   const handleMouseUp = useCallback(e => {
    setIsMouseDown(false);
    props.setSvg(fakeCtx.getSerializedSvg(true))

  },[setIsMouseDown,fakeCtx])

  useEffect(() => {
    setRect(canvasRef.current.getBoundingClientRect());
  },[setRect])

  useEffect(() => {
    setFakeCtx(new C2S(348,198));
  },[])

  useEffect(() => {
    const ref = canvasRef.current;
    setCtx(ref.getContext('2d'));
    ref.addEventListener('mousedown', handleMouseDown)
    ref.addEventListener('mouseup', handleMouseUp)
    ref.addEventListener('mousemove', handleMouseMove)

    return (
      () => {
        ref.removeEventListener('mousedown', handleMouseDown)
        ref.removeEventListener('mouseup', handleMouseUp)
        ref.removeEventListener('mousemove', handleMouseMove)
      }
    )
  },[handleMouseDown, handleMouseUp, handleMouseMove, setCtx])


  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} width="348px" height="198px" className="avatar-canvas"/>
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
        <AvatarCanvas setSvg={setSvg}/>
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
      Object.keys(props.players).
        filter(id =>
          props.players[id].team === props.team
        ).map(id => (
          <div key={id} style={{
            margin: '5px', color: props.players[id].isCluegiver ? 'orange' : props.color
          }}>
            {props.players[id].name}
          </div>
        ))
      }
  </div>
)

const SVG = props => {
  const svgRef = useRef(null);
  const getSvg = useApiCall('getSvg', { id: props.id });
  const [svg, setSvg] = useState(null);
  useEffect(() => {
    getSvg().then(result => {setSvg(result); console.log(result);})

  },[props.id,setSvg])

  return (
    <div dangerouslySetInnerHTML={{__html:svg }}>

    </div>
  )
}

const PlayersReadout = props => {
  return (
    <div className="players-readout">
      <TeamDisplay color={'#34BAEB'} team="BLUE" players={props.gameState.players}/>
      <TeamDisplay color={'#DE6228'} team="RED" players={props.gameState.players}/>
      <div>
        {
          props.gameState.svgs.map(svg => (
            <SVG id={svg.id} key={svg.id}></SVG>
          ))
        }
      </div>
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
