import React, { useState, useCallback, useEffect } from 'react';
import Stepper, { Step } from './Stepper/Stepper';
import '../css/Details.css';
import DottedBackground from './Background';
import AnimatedModalDemo from './Animated-button-final';
import GlareHover from './GlareHover/GlareHover';
import DualScrollPicker_weight from './DualScrollPicker.jsx'; 
import DualScrollPicker_Height from './Dualscroll_height.jsx';
import AgeScrollPicker from './SingleScroll.jsx';
import LiveLocationFinder from './Location.jsx';
import AnimatedList from './AnimatedList/AnimatedList.jsx';
import {useNavigate} from 'react-router-dom';

export const Details = () => {
    const navigate = useNavigate();
    const [customTarget, setCustomTarget] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        gender: null,
        location: null,
        weight: null,
        height: null,
        targetWeight: null,
        age: null,
        weightGoal: null,
        activityLevel: '',
        medicalDisabilities: ''
    });

    const handleWeightChange = useCallback((kg, decimal) => {
        const combinedWeight = kg + decimal / 10;
        setFormData(prevData => ({ ...prevData, weight: combinedWeight }));
    }, []); 

    const handleTargetWeightChange = useCallback((kg, decimal) => {
        const combinedWeight = kg + decimal / 10;
        setFormData(prevData => ({ ...prevData, targetWeight: combinedWeight }));
    }, []);

    const handleHeightChange = useCallback((cm, decimal) => {
        const combinedHeight = cm + decimal / 10;
        setFormData(prevData => ({ ...prevData, height: combinedHeight }));
    }, []);

    const handleAgeChange = useCallback((selectedAge) => {
        setFormData(prevData => ({ ...prevData, age: selectedAge }));
    }, []);

    const calculateBMI = () => {
        if (formData.weight && formData.height && formData.age) {
            const heightInMeters = formData.height / 100;
            const bmi = formData.weight / (heightInMeters * heightInMeters);
            return bmi.toFixed(1);
        }
        return null;
    };

    const calculateHealthyWeightRange = () => {
        if (formData.height && formData.age) {
            const heightInMeters = formData.height / 100;
            let minBMI = 18.5;
            let maxBMI = 24.9;
            if (formData.age < 18) {
                minBMI = 15; // Placeholder for younger individuals
                maxBMI = 25;
            }
            const minWeight = minBMI * (heightInMeters * heightInMeters);
            const maxWeight = maxBMI * (heightInMeters * heightInMeters);
            return {
                min: minWeight.toFixed(1),
                max: maxWeight.toFixed(1)
            };
        }
        return null;
    };

    useEffect(() => {
        const range = calculateHealthyWeightRange();
        if (range && !customTarget && formData.weightGoal && formData.weight) {
            let targetWeight;
            if (formData.weightGoal === 'gain') {
                targetWeight = parseFloat(range.max);
            } else if (formData.weightGoal === 'maintain') {
                targetWeight = formData.weight;
            } else if (formData.weightGoal === 'lose') {
                targetWeight = parseFloat(range.min);
            }
            setFormData(prev => ({ ...prev, targetWeight }));
        }
    }, [formData.height, formData.age, formData.weight, formData.weightGoal, customTarget]);

    return(
        <div className="details-page-wrapper">
            <DottedBackground>
                <Stepper initialStep={1} onFinalStepCompleted={async() => {
                    console.log("Form Data Submitted:", formData);
                    try {
                        const token = localStorage.getItem('fitmate_token');
                        if (!token) {
                            alert('You must be logged in before submitting details. Please log in.');
                            navigate('/login');
                            return;
                        }
                        const dataToSubmit = {
                            ...formData,
                            bmi: calculateBMI()
                        };

                        const response = await fetch('http://localhost:5000/api/details/details_cu', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(dataToSubmit)
                        });

                        const result = await response.json();

                        if (!response.ok) {
                            throw new Error(result.message || 'Failed to save details.');
                        }

                        console.log('Success:', result);
                        alert('Your details have been saved successfully!');
                        navigate("/dashboard");
                    } catch (error) {
                        console.error('Submission Error:', error);
                        alert(`An error occurred: ${error.message}`);
                    } 
                    }}>
                    <Step>
                        <div className="step-content">
                            <h3>Hey There 👋🏻!</h3>
                            <p>We're happy that you've taken the first step towards a healthier you. We need a few details to kickstart your journey.</p>
                            <br />
                            <h3>What is your name?</h3>
                            <input
                                type='name' 
                                placeholder='Enter your name' 
                                className='input'
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </Step>
                    <Step>
                        <div className="step-content">
                            <h3>What's your biological sex?</h3>
                            <p>We support all forms of gender expression. However, we need this to calculate your body metrics.</p>
                            <br />
                            <div className="box_out">
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div 
                                        style={{ 
                                            border: formData.gender === 'male' ? '2px solid black' : '1px solid transparent',
                                            borderRadius: '10px',
                                            transition: 'border 0.2s ease'
                                        }}
                                        onClick={() => {
                                            setFormData({ ...formData, gender: 'male' })
                                        }}
                                    >
                                        <GlareHover 
                                            children={'Male'} 
                                            height='80px' 
                                            width='100px' 
                                            background={'rgb(215, 215, 215)'} 
                                            borderColor='rgb(215,215,215)' 
                                        />
                                    </div>
                                    <div 
                                        style={{ 
                                            border: formData.gender === 'female' ? '2px solid black' : '1px solid transparent',
                                            borderRadius: '10px',
                                            transition: 'border 0.2s ease'
                                        }}
                                        onClick={() => setFormData({ ...formData, gender: 'female' })}
                                    >
                                        <GlareHover 
                                            children={'Female'} 
                                            height='80px' 
                                            width='100px' 
                                            background={'rgb(215, 215, 215)'} 
                                            borderColor='rgb(215,215,215)' 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Step>
                    <Step>
                        <div className="step-content">
                            <LiveLocationFinder 
                                value={formData.location}
                                onChange={(newLocation) => {
                                    setFormData({ ...formData, location: newLocation });
                                }}
                            />
                        </div>
                    </Step>
                    <Step>
                        <div className="step-content">
                            <h3>What's your current weight?</h3>
                            <DualScrollPicker_weight onSelectionChange={handleWeightChange} />
                        </div>
                    </Step>
                    <Step>
                        <div className="step-content">
                            <h3>What's your current Height?</h3>
                            <DualScrollPicker_Height onSelectionChange={handleHeightChange} />
                        </div>
                    </Step>
                    <Step>
                        <div className="step-content">
                            <h3>What's your current Age?</h3>
                            <AgeScrollPicker onSelectionChange={handleAgeChange} />
                        </div>
                    </Step>
                    <Step>
                        <div className="step-content">
                            <h3>What's your weight goal?</h3>
                            <p>Select whether you want to gain, maintain, or lose weight.</p>
                            <br />
                            <div className="box_out">
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div 
                                        style={{ 
                                            border: formData.weightGoal === 'gain' ? '2px solid black' : '1px solid transparent',
                                            borderRadius: '10px',
                                            transition: 'border 0.2s ease'
                                        }}
                                        onClick={() => {
                                            setFormData({ ...formData, weightGoal: 'gain' });
                                            setCustomTarget(false);
                                        }}
                                    >
                                        <GlareHover 
                                            children={'Gain Weight'} 
                                            height='80px' 
                                            width='120px' 
                                            background={'rgb(215, 215, 215)'} 
                                            borderColor='rgb(215,215,215)' 
                                        />
                                    </div>
                                    <div 
                                        style={{ 
                                            border: formData.weightGoal === 'maintain' ? '2px solid black' : '1px solid transparent',
                                            borderRadius: '10px',
                                            transition: 'border 0.2s ease'
                                        }}
                                        onClick={() => {
                                            setFormData({ ...formData, weightGoal: 'maintain' });
                                            setCustomTarget(false);
                                        }}
                                    >
                                        <GlareHover 
                                            children={'Maintain Weight'} 
                                            height='80px' 
                                            width='120px' 
                                            background={'rgb(215, 215, 215)'} 
                                            borderColor='rgb(215,215,215)' 
                                        />
                                    </div>
                                    <div 
                                        style={{ 
                                            border: formData.weightGoal === 'lose' ? '2px solid black' : '1px solid transparent',
                                            borderRadius: '10px',
                                            transition: 'border 0.2s ease'
                                        }}
                                        onClick={() => {
                                            setFormData({ ...formData, weightGoal: 'lose' });
                                            setCustomTarget(false);
                                        }}
                                    >
                                        <GlareHover 
                                            children={'Lose Weight'} 
                                            height='80px' 
                                            width='120px' 
                                            background={'rgb(215, 215, 215)'} 
                                            borderColor='rgb(215,215,215)' 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Step>
                    <Step>
                        <div className="step-content">
                            <h3>Your BMI and Target Weight</h3>
                            <p>Your Body Mass Index (BMI) is calculated based on your age, height, and weight.</p>
                            <br />
                            {calculateBMI() ? (
                                <div>
                                    <h4>Your BMI: {calculateBMI()}</h4>
                                    <p>
                                        {parseFloat(calculateBMI()) < 18.5 ? "Underweight" :
                                         parseFloat(calculateBMI()) < 25 ? "Normal weight" :
                                         parseFloat(calculateBMI()) < 30 ? "Overweight" :
                                         "Obese"}
                                    </p>
                                    {calculateHealthyWeightRange() && (
                                        <div>
                                            <p>Suggested healthy weight range: <strong>{calculateHealthyWeightRange().min} - {calculateHealthyWeightRange().max} kg</strong></p>
                                            <p>Your target weight is set to {formData.targetWeight} kg based on your goal to {formData.weightGoal} weight.</p>
                                            {!customTarget && (
                                                <button className="my_button" onClick={() => setCustomTarget(true)}>
                                                    Set your own target weight
                                                </button>
                                            )}
                                            {customTarget && (
                                                <div>
                                                    <button className="my_button">
                                                        Select your target weight
                                                    </button>
                                                    <DualScrollPicker_weight onSelectionChange={handleTargetWeightChange} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p>Please provide age, height, and weight to calculate BMI.</p>
                            )}
                        </div>
                    </Step>
                    <Step>
                        <div className="step-content">
                            <h3>How active are you?</h3>
                            <p>Based on your lifestyle, we can assess your daily calorie requirements.</p>
                            <div>
                                <AnimatedList showGradients={false} displayScrollbar={false} items={[
                                        "Mostly Sitting Seated work, low movement.",
                                        "Often Standing Standing work, occasional walking.",
                                        "Regularly Walking Frequent walking, steady activity.",
                                        "Physically Intense Work Heavy labor, high exertion."
                                    ]}  
                                    onItemSelect={(selectedActivity, index) => {
                                        setFormData(prevData => ({
                                            ...prevData,
                                            activityLevel: selectedActivity
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </Step>
                    <Step>
                        <div className="step-content">
                            <h3>Medical disabilities</h3>
                            <input 
                                type='text' 
                                placeholder='Enter your Disabilities' 
                                className='input'
                                value={formData.medicalDisabilities}
                                onChange={(e) => setFormData({ ...formData, medicalDisabilities: e.target.value })}
                            />
                        </div>
                    </Step>
                </Stepper>
            </DottedBackground>
        </div>
    );
}