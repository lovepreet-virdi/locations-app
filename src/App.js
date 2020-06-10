import React from 'react';
import './App.scss';
import NoLocation from './noLocation';
import Header from './header';
import Container from '@material-ui/core/Container';
import LocationsList from './locationsList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: null,
      locationsList: []
    }

  }
  componentDidMount() {
    // In the following line, you should include the prefixes of implementations you want to test.
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || { READ_WRITE: "readwrite" }; // This line should only be needed if it is needed to support the object's constants for older browsers
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
    if (!indexedDB) {
      console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    } else {
      let request = indexedDB.open("qssDB", 1);
      request.onerror = function (event) {
        console.log('connection to database failed---', event)
        // Do something with request.errorCode!
      };
      request.onsuccess = (event) => {
        // console.log('success event---', event)
        // Do something with request.result!
        let db = event.target.result;
        this.setState({
          db: db
        }, () => {

          let transaction = db.transaction('locations');
          let locationsStore = transaction.objectStore('locations');
          // fetch all saved records
          locationsStore.openCursor().onsuccess = (event) => {
            // console.log('fetched data----', event)
            let cursor = event.target.result;
            if (cursor) {
              // console.log('cursor ', cursor.key, cursor.value);
              this.setState((prevState) => {
                let old = [...prevState.locationsList];
                old.push({ key: cursor.key, ...cursor.value });
                return {
                  locationsList: old
                }
              }, () => cursor.continue())

            } else {
              console.log('No more data');
            }
          };

        })
      };
      request.onupgradeneeded = function (event) {
        let db = event.target.result;
        let locationsStore = db.createObjectStore('locations', { autoIncrement: true });
        // console.log('onupgradeneeded --', event)
        locationsStore.createIndex("locationName", "locationName", { unique: false });
        // Use transaction oncomplete to make sure the locationsStore creation is  finished before adding data into it.
        locationsStore.transaction.oncomplete = function (event) {
          // Store values in the newly created objectStore.
          // console.log('store created---', event)
        };


      };
    }
  }
  handleLocationsRefresh = () => {
    let db = this.state.db;
    this.setState({
      locationsList: []
    }, () => {
      if (db) {
        let transaction = db.transaction('locations');
        let locationsStore = transaction.objectStore('locations');
        // fetch all saved records
        locationsStore.openCursor().onsuccess = (event) => {
          let cursor = event.target.result;
          if (cursor) {
            this.setState((prevState) => {
              let old = [...prevState.locationsList];
              old.push({ key: cursor.key, ...cursor.value });
              return {
                locationsList: old
              }
            }, () => cursor.continue())

          } else {
            console.log('No more data');
          }
        };
      }
    })


  }
  render() {

    return (
      <div className="App">
        <ToastContainer />
        <Header handleLocationsRefresh={this.handleLocationsRefresh} db={this.state.db} />
        <Container className="pt-3 bg-grey">
          {this.state.locationsList.length ? <LocationsList handleLocationsRefresh={this.handleLocationsRefresh} db={this.state.db} locationsList={this.state.locationsList} />
            :
            <NoLocation />}
        </Container>

      </div>
    );
  }

}

export default App;
