import React, { Component } from "react";
import styled from 'styled-components';
import Colors from '../../styles/colors';
import Fonts from '../../styles/fonts';
import DisplayInstrument from '../../components/studio/DisplayInstrument';
import '../../styles/animation.css'; //animation instrument
import ControlePlayer from "../../components/studio/ControlePlayer";
import protosound from '../../assets/proto-sound/silence-voice.mp3';
import {Grid} from 'semantic-ui-react';
import {setTimeout} from "timers";


class Studio extends Component {
  constructor(props) {
    super(props);

    this.buttons = []; //initialisation de mes buttons
    // je sélectionne tous mes boutons ('équivalent d'un querySelectorAll('button') grace à l'attribut ref que j'ai placé soigneusement dans chaque bouton
    // ainsi qu'a l'initialisation de mon tableau')
    this.selectorButtons = element => {
      this.buttons = [...this.buttons,element] // à chaque boucle j'insère mes boutons dans mon tableau, remarque: on peut simplement faire un push(element) mais je trouve ça plus badass
    };
  }
  state = {
    isSelected: false,
    showInstrument: false,
    prevSelect:{},
    name:'',
    img:null,
    details:'',
    id:'',
    select:{
      name:'',
      img: '',
      details: '',
      id:'',
      sound:null,
    },
    // données statiques, on fera une boucle par la suite
    instruments: [...this.props.instruments]
  }

  removeButtonClasse(index,className){
    if(this.buttons[index].classList.contains(className)) {
      this.buttons[index].classList.remove(className)
    }
  }
  settiemout = () =>{
    setTimeout(()=>{
      const {img,name,details, id} = this.state.prevSelect;
      this.setState({
        showInstrument: true,
        img,
        name,
        details,
        id
      })
    }
    ,500)
  }
  setTimeoutEnter = () => {
    const {img,name,details, id} = this.state.select
    this.setState({
      img,
      name,
      details,
      id
    })
  }  
  
  selectInstrument(id) {
    // à faire: changement de style
    const current_btn = this.buttons[id];
    if(current_btn.classList.contains('selected')) {

      return false;
    }

    this.buttons.map((button,i) => {
      if(current_btn === button) {
        button.classList.add('selected')
        this.removeButtonClasse(i,'unselected')

        //j'insere mon instrument dans l'état select
        const select = this.state.instruments[id];
        this.setState(prev=>{
          return{
            isSelected: true,
            showInstrument: false,
            select: select,
            PrevSelect: {
              img:prev.select.img,
              name:prev.select.name,
              details:prev.select.details,
              id:prev.select.id
            }
          }
        })
        this.props.handleSelected(select)
      } else {
        //du style css
        button.classList.add('unselected')
        this.removeButtonClasse(i,'selected')
      }
    })
  }


  render(){
    const {isSelected,select} = this.state; 
    return (
      <StudioComponent>
        <Grid className="studio-container">
          <Grid.Row centered columns={3}>
            <Grid.Column mobile={16} tablet={5} computer={5}>
              <h1 id="title" className='only-mobile'>Mélodie</h1>
            </Grid.Column>
            <Grid.Column textAlign='center' mobile={16} tablet={6} computer={6}>
              <DisplayInstrument
              isSelected={isSelected}
              showInstrument={this.state.showInstrument}
              enter={this.setTimeoutEnter}
              exit={this.settiemout}
              name={this.state.name}
              img={this.state.img}
              details={this.state.details}
              id={this.state.id}
              />

              <h1 className="studio-title">{this.props.title}</h1>
              <h2 className="studio-artist">{this.props.artist}</h2>
              <ControlePlayer
              insertsong={true}
              reset={this.props.reset}
              checkindex={this.props.checkindex}
              url={protosound}
              selected={this.state.isSelected}
              select={this.state.select}
              />
          </Grid.Column>
          <Grid.Column className="chooseInstrument-container" verticalAlign="middle" textAlign='center' mobile={16} tablet={5} computer={5}>
          <div className="test">
            {this.state.instruments.map((intrument,i) =>(
              <button
              key={i} //à référencer quand on map du html (cf react)
              ref={this.selectorButtons} //ma référence me permet de cibler ce button pour récupérer des éléments de celui-ci
              onClick={() =>this.selectInstrument(i)} // quand je clique, je récupère mon button, à finir
              className={`chooseInstrument-btn`}
              >
                <img src={intrument.img}/>
              </button>
            ))}
            </div>
          </Grid.Column>
          </Grid.Row>
        </Grid>
      </StudioComponent>
    )
  }
};

const StudioComponent = styled.div
  `
  height: 100vh;
  overflow: hidden;
  min-height: 375px;
  @media screen and (min-width: 768px){
    min-height: 600px;
  }
  .studio-container {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  @media screen and (min-width: 768px){
    .studio-container {
      padding-top:100px !important;
    }
  }
  #title {
    text-align: center;
    font-size: 18px;
    margin-bottom:16px;
    margin-top: 18vw;
    color: ${Colors.text};
    font-family: ${Fonts.title};
  }
  @media screen and (min-width: 768px) {
    #title {
      text-align: left;
    }
  }
  .ui.button.studio-btn-audio.mobile {
    transition: all 0.3s ease;
    background-color: #741AB0;
    border: 1px solid rgba(255,255,255,0.2);
    color:#FFFCF2;
  }

  .studio-btn-audio.mobile:nth-child(2){
    margin: 0 24px;
  }

  .studio-title,
  .studio-artist {
    color: ${Colors.text};
    font-family: ${Fonts.title};
    font-size:18px;
    font-weight:400;
    margin-bottom:0;
  }


  .studio-title {
    margin-top:32px;
  }
  @media screen and (min-width:768px) {
    .studio-title {
      margin-top:56px;
    }
  }
  .studio-artist {
    margin-top:0;
  }

  .btn-instrument.mobile {
    width:32px;
    height:32px;
    border-radius:50%;
  }

  .studio-chose-instrument-items img{
    margin: auto;
    overflow:hidden;
  }
  .chooseInstrument-btn {
    outline:0;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin: 0 8px;
    cursor: pointer;
    border: 0;
    padding: 12px;
    background-color: rgba(216,216,216,0.20);
    cursoir: pointer;
    transition: all 0.4s ease;
  }

  .chooseInstrument-btn.selected {
    background-color: rgba(216,216,216,0.4);
  }

  .chooseInstrument-btn.unselected {
    opacity:0.5;
  }
  .chooseInstrument-btn img {
    height: 100%;
  }
  .chooseInstrument-container {
    padding-top:12px;
  }
  
  @media screen and (min-width:768px){
    .chooseInstrument-container {
      padding-top:0;
      position: relative;
      top: 200px;
      transform: translateY(-50%);
    }
    .test{
      display:flex;
      width:10%;
      flex-direction:column;
      flex-wrap:wrap;
    }
    .chooseInstrument-btn {
      width: 72px;
      height: 72px;
    }
    .chooseInstrument-btn:not(:first-child),
    .chooseInstrument-btn:not(:last-child)
     {
      margin-top: 12px;
      margin-bottom: 12px;
    }
    .chooseInstrument-btn:first-child,
    .chooseInstrument-btn:last-child
     {
      margin-left:-50%;
    }
  }

  @media screen and (min-width: 768px){
    .only-mobile {
      display:none ;
    }
    .only-desktop {
      display:flex;
      flex-direction: column;
    }

    
  }
  `;

export default Studio;