import React, { Component } from 'react'
import firebase from '../firebase.js';
import PlantData from '../PlantData.json';

export default class PlantRoster extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            plants: [],
        }
    }

    componentDidMount() {
        this.initialFetch();
    }

    initialFetch() {
        const plantsRef = firebase.database().ref('plants');
        plantsRef.once('value', (snapshot) => {
            if (snapshot.val()) {
                let savedPlants = Object.values(snapshot.val());
                let newState = [];
                PlantData.forEach(plant => {
                    let existingPlant = savedPlants.find(entry => entry.name ===  plant.name);
                    if (existingPlant) {
                        newState.push(existingPlant);
                    } else {
                        plant.days_since_last_water = 0;
                        plant.has_been_watered = false;
                        plant.water_after = parseInt(plant.water_after); 

                        plantsRef.push(plant);
                        newState.push(plant);
                    }
                });
                this.setState({plants: newState});
            } else {
                let newState = [];
                PlantData.forEach(plant => {
                    plant.days_since_last_water = 0;
                    plant.has_been_watered = false;
                    plant.water_after = parseInt(plant.water_after);

                    plantsRef.push(plant);
                    newState.push(plant);
                });
                this.setState({plants: newState});
            }
        })
    }
    
    
    render() {
        console.log('this.state = ', this.state);
        return (
            <div>
                {this.state.plants}
            </div>
        )
    }
}
