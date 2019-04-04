class Tile extends React.Component {
  constructor(props) {
  super(props);
  this.state = {

    };
  }

  render() {
    if(this.props.value == -1){
      //unrevealed
      return(<a id = "hiddenTile" onClick={this.props.onClick} onContextMenu={this.props.onContextMenu}>{}</a>)
    }
    else if (this.props.value == 0) {
      //revealed no neighbours
      return(<a id = "emptyTile" onClick={this.props.onClick}>{}</a>)
    }
    else if (this.props.value == -2) {
      //mine
      return(<a id = "mineTile" onClick={this.props.onClick}>💥</a>)
    }
    else if (this.props.value == -3) {
      //flag
      return(<a id = "hiddenTile" onClick={this.props.onClick} onContextMenu={this.props.onContextMenu}>🚩</a>)
    }
    else if (this.props.value == -4) {
      //flag
      return(<a id = "winMineTile" onClick={this.props.onClick}>⚠️</a>)
    }
    else{
      //normal tile with neighbour mines
      return(<a id = "normalTile" onClick={this.props.onClick}>{this.props.value}</a>)
    }
  }
}

class Board extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    tiles: [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                   [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]],
    gameEnd:0,
    flaggedList: []
    //x and y coordinates pf flaggedList/
    //[[x1,y1],[x2,y2],....,etc]
    //if === to coordinate on boardFlag/
    //u know it's a flaggedList
    //wow i love maya so much
    //cuz i ge6 her to do so much shit for me
    //otherwise i ignore her
    //like wow im so glad to have a useful girlfr5iend
    //so eaassy to love somebody that does shit for u
           }

         }

  handleClick(row, col){
    console.log("ROW " + row + " COL " + col)
    fetch(`./board/` + '?' + 'id=' + this.props.gameID + '&' +'col=' + col + '&' + 'row=' + row)
    .then(response => response.json())
    .then(response =>{
      console.log("RESPONSE BOARD: " + response)
      var getEnd = 0;
      function exists(arr, search) {
        return arr.some(row => row.includes(search));
      }
      if(exists(response.board, -4)){
        getEnd = 1
        alert("🏆Winner!🏆 Nice Job 😎");
      }
      if(exists(response.board, -2)){
        getEnd = 2
        alert("💥BOOM💥 you lose ⚰️");
      }
      //traverse board and edit its values
      console.log(this.state.flaggedList);
      for(let i = 0; i < response.board.length; i++){
        for(let j = 0; j < response.board.length; j++){
          for(let k = 0; k < this.state.flaggedList.length; k++){
            if(this.state.flaggedList[k][0] == i && this.state.flaggedList[k][1] == j && response.board[i][j] == -1){
              response.board[i][j] = -3;
            }
          }
        }
      }
      this.setState({
        tiles: response.board,
        gameEnd: getEnd //0 signifies not ended, 1 = win, 2 = lose
      })
    }
    )
    .catch(error => this.setState({ error, isLoading: false }));
  }

  handleRightClick(row,col){
    var tmpTiles = this.state.tiles;
    if(tmpTiles[row][col] == -3){
      this.state.flaggedList.filter(val => val !== [row,col])
      tmpTiles[row][col] = -1;
    }
    else if(tmpTiles[row][col] == -1){
      this.state.flaggedList.push([row,col]);
      tmpTiles[row][col] = -3;
    }
    this.setState({
      tiles: tmpTiles
    })
  }

  handleClickEnd(){
    console.log("Clicked on game over: " + this.state.gameEnd)
    ReactDOM.render(<Entry/>, document.getElementById('root'));
  }

  handleReturnButton(){
    console.log("return request");
    ReactDOM.render(<Entry/>, document.getElementById('root'));
  }

  componentDidMount(){
    fetch(`./getBoard/` + '?' + 'id=' + this.props.gameID)
    .then(response => response.json())
    .then(response =>{
        var getEnd = 0;
        function exists(arr, search) {
          return arr.some(row => row.includes(search));
        }
        if(!exists(response.board, -1)){
          getEnd = 1
        }
        if(exists(response.board, -2)){
          getEnd = 2
        }
      this.setState({
        tiles: response.board,
        gameEnd: getEnd
      })
    }
    )
    .catch(error => this.setState({ error, isLoading: false }));

  }

  render() {
    var ref = ((x,y)=>{return this.handleClick(x,y)});
    var refEnd = ((x,y)=>{return this.handleClickEnd(x,y)});
    var refContextMenu = ((x,y)=>{return this.handleRightClick(x,y)});
    var refGameStatus = this.state.gameEnd;

    var drawBoard = this.state.tiles.map(function (item, i) {
           var entry = item.map(function (element, j) {
             console.log(refGameStatus);
               if(refGameStatus != 0){
                 return (
                   <Tile key = {j} value = {element} onClick = {() => refEnd(i,j)} onContextMenu = {() => refContextMenu(i,j)} />
                     );
               }
               else{
                 return (
                   <Tile key = {j} value = {element} onClick = {() => ref(i,j)} onContextMenu = {() => refContextMenu(i,j)}/>
                     );
               }
           });
           return (
               <div key={i}> {entry} </div>
            );
       });
    return(
      <div id = "gameParent">
        <div id = "gameTitle">
          <h1>Minesweeper</h1>
          <a href = "http://adroberts.me/" target="_blank" id = "anthonyHeader">Anthony Roberts</a>
          <h3>Game ID: {this.props.gameID}</h3>
        </div>
        <div id = "gameBoard">
          {drawBoard}
        </div>
        <div id = "gameReturnParent">
          <button id = "gameReturnButton" onClick = {() => this.handleReturnButton()}>Return</button>
        </div>
        <a id = "github" href="https://github.com/anthonydroberts" target="_blank">
          <i class = "fab fa-github-square"></i> Github
        </a>
      </div>
    )
  }

}

class Game extends React.Component {
  constructor(props) {
  super(props);
  this.state = {

  }
  }

  render() {
    return(
        <Board gameID={this.props.gameID} />
    )
  }

}

class Entry extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    difficulty: 'easy',
    gameID: '',
    gameExists: 0
    };
    this.handleChangeNewGame = this.handleChangeNewGame.bind(this);
    this.handleChangeResumeGame = this.handleChangeResumeGame.bind(this);
    this.handleSubmitNewGame = this.handleSubmitNewGame.bind(this);
    this.handleSubmitResumeGame = this.handleSubmitResumeGame.bind(this);
  }

  handleChangeNewGame(event) {
    this.setState({difficulty: event.target.value});
  }

  handleChangeResumeGame(event) {
    this.setState({gameID: event.target.value});
  }

  handleSubmitNewGame(event) {
    console.log("Start new game, difficulty: " + this.state.difficulty);
    fetch(`./newBoard/` + '?' + 'difficulty=' + this.state.difficulty)
    .then(response => response.json())
    .then(response =>{
      console.log("RESPONSE: " + response)
      this.setState({
        gameID: response
      })
    }
    )
    .then(() => {return ReactDOM.render(<Game gameID={this.state.gameID}/>, document.getElementById('root'));})
    .catch(error => this.setState({ error, isLoading: false }));
    event.preventDefault();
  }

  handleSubmitResumeGame(event) {
    console.log("Resume a game, GameID: " + this.state.gameID);
    fetch(`./getGameExist/` + '?' + 'id=' + this.state.gameID)
    .then(response => response.json())
    .then(response =>{
      console.log("GAMEEXISTRESPONSE: " + response)
      this.setState({
        gameID: this.state.gameID,
        gameExists: response
      })
    }
    )
    .then(() => {
      console.log(this.state.gameExists);
      if(this.state.gameExists == 1){
        return ReactDOM.render(<Game gameID={this.state.gameID}/>, document.getElementById('root'));
      }
      else{
        alert("Game not found");
      }
    })
    .catch(error => this.setState({ error, isLoading: false }));
    event.preventDefault();
  }

  render() {
    return(
      <div id = "entryMenu">
        <h1>Minesweeper</h1>
        <a href = "http://adroberts.me/" target="_blank" id = "anthonyHeader">Anthony Roberts</a>
        <p>New game:</p>
        <form onSubmit={this.handleSubmitNewGame}>
          <select id = "entryInputField" value={this.state.difficulty} onChange={this.handleChangeNewGame}>
            <option value="easy">Easy (10 mines)</option>
            <option value="medium">Medium (30 mines)</option>
            <option value="hard">Hard (50 mines)</option>
          </select>
          <input type="submit" value="Start" />
        </form>

        <p>... Or resume game:</p>
        <form onChange={this.handleChangeResumeGame} onSubmit={this.handleSubmitResumeGame}>
          <input id = "entryInputField" type="text" size="4" placeholder="Game ID" />
          <input type="submit" value="Resume" />
        </form>
        <a id = "github" href="https://github.com/anthonydroberts" target="_blank">
          <i class = "fab fa-github-square"></i> Github
        </a>
      </div>
    )
  }
}

ReactDOM.render(<Entry/>, document.getElementById('root'));
