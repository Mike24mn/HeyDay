import React, { useState, useEffect} from 'react';
import UserNavBar from '../UserNavBar/UserNavBar';

// It seems like we will have to parse Google reviews 
// to get Vibe and Diet, which is cool but maybe not super 
// reliable lol

// Need to import nlp.js modules

import { containerBootstrap } from '@nlpjs/core'; // destructure and require in Bootstrap container for NLP (this will be the "home" to managing nlp components and is meant for dependency injection which helps decouple classes and instances)
import { Nlp } from '@nlpjs/nlp'; // destructure and require in the nlp module itself
import { LangEn } from '@nlpjs/lang-en-min'; // use English, because we say so
// this stuff will need to be integrated into the function below, UserFavoriteLocations, im sure

// async would basically make it so the container is properly loaded before proceeding???


function UserFavoriteLocations() {

const [nlpResponse, setNlpResponse] = useState("") // setter and getter to manage state changes and store NLP processing

useEffect(() => {
    async function setupNlp() {
        const container = await containerBootstrap() 
        container.use(Nlp) // This actually makes it so the Nlp class is used within the container giving access to NLP functionalities that the module has
        container.use(LangEn) // container only uses English currently
        const nlp = container.get('nlp') // RETRIEVES (not creates) an instance of the class we made above called Nlp AKA RETRIVES the already instantiated instance
        nlp.settings.autoSave = false; // dont autosave MODEL CHANGES, I.e, dont persist them across sessions
        nlp.addLanguage('en'); // use english because thats what we are telling it to
        // Adds training DATA to the machine with example phrases and intents,
        // we are teaching the machine model
        nlp.addDocument('en', 'goodbye for now', 'greetings.bye');
        nlp.addDocument('en', 'bye bye take care', 'greetings.bye');
        nlp.addDocument('en', 'okay see you later', 'greetings.bye');
        nlp.addDocument('en', 'bye for now', 'greetings.bye');
        nlp.addDocument('en', 'i must go', 'greetings.bye');
        nlp.addDocument('en', 'hello', 'greetings.hello');
        nlp.addDocument('en', 'hi', 'greetings.hello');
        nlp.addDocument('en', 'howdy', 'greetings.hello');
        // This text below must be the response we are programming the machine 
        // to respond with after the above information is given to it
        // i.e, how we want to machine to REACT to the above DATA in 
        // addDocument
        nlp.addAnswer('en', 'greetings.bye', 'Till next time');
        nlp.addAnswer('en', 'greetings.bye', 'see you soon!');
        nlp.addAnswer('en', 'greetings.hello', 'Hey there!');
        nlp.addAnswer('en', 'greetings.hello', 'Greetings!');
        await nlp.train(); // This actually trains the model with the
        // documents we provided and answers we gave in .addDocument
        // and .addAnswer, preparing it to "know better" in the future
        // and handle similar inputs with more precision
        const response = await nlp.process('en', 'I should go now') // create a response
        // process input text "I should go now" and returns a response
        // BASED ON THE MODELING AND CONDITIONING WE GAVE IT ABOVE
        // Then generates an appropriate response based on its
        // learning
        setNlpResponse(JSON.stringify(response, null, 2))

    }
    // call setupNlp
    setupNlp()
},
[] // empty dependency array, wont allow updates/will ensure componenet only renders once on initial DOM load
)

  return (
    <div>
      UserFavoriteLocations
      <p>Commence Language Machine Learning Experimentation:</p>
      <pre>{nlpResponse}</pre>
      <center><UserNavBar /></center>

    </div>
  );
}

export default UserFavoriteLocations;
