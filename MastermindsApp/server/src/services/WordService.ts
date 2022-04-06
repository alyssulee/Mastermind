import { GameWord, WordCategory } from "../interfaces/GameWord"

export class WordService 
{
    wordList: string [];

    constructor() 
    { 
        this.wordList = this.ReadWordListFile();
    }

    /**
     * Reads the wordlist.txt file and generates a master list of words
     */
    private ReadWordListFile() : string []
    {
        let fs = require('fs');
        let path = require('path');
        let text = fs.readFileSync(path.join(__dirname, '../data') + '/wordlist.txt', 'utf8');
        let textByLine = text.split("\r\n")
        return textByLine;
    }

    /**
     * Generates a unique set of words for the game.
     */
    GenerateWordSet() : GameWord []
    {
        let usedWords = new Set();
        let gameWords = [];
        
        while(gameWords.length < 25)
        {
            // Get Category
            let category : WordCategory;
            let starterRandomizer = Math.round(Math.random());
            switch(true)
            {
                case gameWords.length < 1:
                    category = WordCategory.Bomb;
                    break;
                case (gameWords.length < (9 + starterRandomizer) && gameWords.length >= 1):
                    category = WordCategory.Green;
                    break;
                case (gameWords.length < 18 && gameWords.length >= (9 + starterRandomizer)): 
                    category = WordCategory.Purple;
                    break;
                default: 
                    category = WordCategory.Neutral;
            }

            // Generate Word
            let newWord = this.GenerateRandomWord();
            if(!usedWords.has(newWord))
            {
                let gameWord : GameWord = { word: newWord, category: category, guessed: false, suggested: []}
                gameWords.push(gameWord);
                usedWords.add(newWord);
            }
        }

        return this.ShuffleWordSet(gameWords);
    }

    /**
     * Generates a random word from the master wordList
     */
    private GenerateRandomWord() : string
    {
        return this.wordList[Math.floor(Math.random() * this.wordList.length)]
    }    

    private ShuffleWordSet(array : GameWord []) : GameWord []
    {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
}