define(['jquery'], function($) {
  'use strict';

  var Game = {
    sequence: [],
    copy: [],
    round: 0,
    active: true,
    mode: 'normal',

    init: function() {
      var that = this;
      $('[data-action=start]').on('click', function() {
        that.startGame();
      });
      $('input[name=mode]').on('change', function(e) {
        that.changeMode(e);
      });
      $('p[data-action="lose"]').hide();

    },

    startGame: function() {
      this.sequence = [];
      this.copy = [];
      this.round = 0;
      this.active = true;
      this.newRound();
    },

    // add a new color to the sequence and animate it to the user
    newRound: function() {
      $('[data-round]').text(++this.round);

      var i;
      for (i=0; i<5; i++){
      this.sequence.push(this.randomNumber()); //executes the randomNumber function (below) 5 times
      }

      this.copy = this.sequence;
      this.animate(this.sequence);

      $('[data-action=start]').addClass('none')//removes start button during gameplay
      $('h1').addClass('hide')//hides "press start to play" during gameplay
    },

    // the game is controlled primarily through this function, along with checkLose().
    // Since the player can never actually "win", we just listen for clicks as the user 
    // plays the sequence and each time, check if they lost
    registerClick: function(e) {
      var desiredResponse = this.copy.shift();
      var actualResponse = $(e.target).data('tile');
      this.active = (desiredResponse === actualResponse);
      this.checkLose();
    },

    // three possible situations:
    // 1. The user clicked the wrong color (end the game)
    // 2. The user entered the right color, but is not finished with the sequence (do nothing)
    // 3. The user entered the right color and just completed the sequence (start a new round)
    checkLose: function() {
      // copy array will be empty when user has successfully completed sequence
      if (this.copy.length === 0 && this.active) {
        this.deactivateGameBoard();
        this.newRound();

      } else if (!this.active) { // user lost
        this.deactivateGameBoard();
        this.endGame();
        $('[data-action=start]').removeClass('none')//makes start button active again for next game
        $('h1').removeClass('hide')//brings back "press start to play" 

      }
    },

    endGame: function() {
      // notify the user that they lost and change the "round" text to zero
      $('p[data-action=lose]').show();
      $($('[data-round]').get(0)).text('0');
    },

    changeMode: function(e) {
      this.mode = e.target.value;
    },

    /*----------------- Helper functions -------------------*/

    // allow user to interact with the game
    activateGameBoard: function() {
      var that = this;
      $('.threebythree')
        .on('click', '[data-tile]', function(e) {
          that.registerClick(e);
        })

        .on('mousedown', '[data-tile]', function(){
          $(this).addClass('active');
          that.playSound($(this).data('tile'));
        })

        .on('mouseup', '[data-tile]', function(){
          $(this).removeClass('active');
        });

      $('[data-tile]').addClass('hoverable');

      $('.message-box').append("<p>Try to recreate the sequence by clicking on the tiles in the correct order.</p>"); //prompts user to try and recreate the sequence

    },

    // prevent user from interacting until sequence is done animating
    deactivateGameBoard: function() {
      if (this.mode !== 'free-board') {
        $('.threebythree')
          .off('click', '[data-tile]')
          .off('mousedown', '[data-tile]')
          .off('mouseup', '[data-tile]');

        $('[data-tile]').removeClass('hoverable');

        $('.message-box').html("");//clears message box prompt after users turn

      }
    },

    animate: function(sequence) {
      var i = 0;
      var that = this;
      var interval = setInterval(function() {
        that.playSound(sequence[i]);
        that.lightUp(sequence[i]);

        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          that.activateGameBoard();
        }
      }, 600);
    },

    lightUp: function(tile) {
      if (this.mode !== 'sound-only') {
        var $tile = $('[data-tile=' + tile + ']').addClass('lit');
        window.setTimeout(function() {
          $tile.removeClass('lit');
        }, 300);
      }

    },

    // we are embedding the sound file on the fly for the following benefits:
    // 1. ability to play multiple sounds in a row without waiting for the first to complete,
    // 2. <audio> tag provides our fallbacks (mp3).
    playSound: function(tile) {
      if (this.mode !== 'light-only') {
        var audio = $('<audio autoplay></audio>');
        audio.append('<source src="assets/audio/' + tile + '.mp3" type="audio/mp3" />');
        $('[data-action=sound]').html(audio);
      }
    },

    randomNumber: function() {
      // between 1 and 9
      return Math.floor((Math.random()*9)+1);
    },

    
  };


  return Game;
});