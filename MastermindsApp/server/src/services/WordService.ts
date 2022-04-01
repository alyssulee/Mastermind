class WordService 
{
    wordList: string [];

    constructor() 
    { 
        this.wordList = this.ReadWordListFile();
    }

    ReadWordListFile()
    {
        let fs = require('fs');
        let path = require('path');
        let text = fs.readFileSync(path.join(__dirname, '../data') + '/wordlist.txt', 'utf8');
        let textByLine = text.split("\r\n")
        return textByLine;
    }
}

export {WordService};