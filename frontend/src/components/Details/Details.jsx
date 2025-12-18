import React, { useState, useCallback, useEffect } from 'react';
import Stepper, { Step } from '../Stepper/Stepper.jsx';
import './css/Details.css';
import DottedBackground from './Background.jsx';
import AnimatedModalDemo from '../Animated-button-final.jsx';
import GlareHover from '../GlareHover/GlareHover.jsx';
import DualScrollPicker_weight from './DualScrollPicker.jsx'; 
import DualScrollPicker_Height from './Dualscroll_height.jsx';
import AgeScrollPicker from './SingleScroll.jsx';
import LiveLocationFinder from './Location.jsx';
import AnimatedList from '../AnimatedList/AnimatedList.jsx';
import {useNavigate} from 'react-router-dom';
import "@fontsource/alkatra";

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
        <div style={{fontFamily:"alkatra"}}>
            <DottedBackground >
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
                                            border: formData.gender === 'male' ? '4px solid #492110' : '1px solid transparent',
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
                                            background={'#492110'} 
                                            borderColor='rgb(215,215,215)' 
                                        />
                                    </div>
                                    <div 
                                        style={{ 
                                            border: formData.gender === 'female' ? '4px solid #492110' : '1px solid transparent',
                                            borderRadius: '10px',
                                            transition: 'border 0.2s ease'
                                        }}
                                        onClick={() => setFormData({ ...formData, gender: 'female' })}
                                    >
                                        <GlareHover 
                                            children={'Female'} 
                                            height='80px' 
                                            width='100px' 
                                            background={'#492110'} 
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
                                            border: formData.weightGoal === 'gain' ? '4px solid #492110' : '1px solid transparent',
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
                                            background={'#492110'} 
                                            borderColor='rgb(215,215,215)' 
                                        />
                                    </div>
                                    <div 
                                        style={{ 
                                            border: formData.weightGoal === 'maintain' ? '4px solid #492110' : '1px solid transparent',
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
                                            background={'#492110'} 
                                            borderColor='rgb(215,215,215)' 
                                        />
                                    </div>
                                    <div 
                                        style={{ 
                                            border: formData.weightGoal === 'lose' ? '4px solid #492110' : '1px solid transparent',
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
                                            background={'#492110'} 
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

// /* Custom text colors for Stepper component */

// /* Main stepper container background */
// .step-circle-container {
//     background-color: #ffffff !important; /* White background */
//     border: none !important; /* Remove black outline */
//     box-shadow: 
//         0 20px 25px -5px rgba(0, 0, 0, 0.1),
//         0 10px 10px -5px rgba(0, 0, 0, 0.04),
//         0 0 0 1px rgba(0, 0, 0, 0.05) !important; /* Enhanced shadow effect */
//     /* Alternative shadow effects you can use:
//     box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; Stronger shadow
//     box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; Subtle shadow
//     box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important; With inner highlight
//     */
// }

// /* Step content background */
// .step-content {
//     background-color: transparent; /* Transparent to show container background */
// }

// /* Step content text colors for better contrast */
// .step-content h3 {
//     color: #2563eb; /* Blue color for headings */
//     margin-bottom: 1rem;
// }

// .step-content p {
//     color: #374151; /* Dark gray for paragraph text */
//     line-height: 1.6;
// }

// /* Override Stepper button colors */
// .back-button {
//     color: #6b7280 !important; /* Gray color for back button */
// }

// .back-button:hover {
//     color: #374151 !important; /* Darker gray on hover */
// }

// .next-button {
//     color: #ffffff !important; /* White text for next button */
//     background-color: #2563eb !important; /* Blue background */
//     box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2) !important; /* Button shadow */
// }

// .next-button:hover {
//     background-color: #1d4ed8 !important; /* Darker blue on hover */
//     box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3) !important; /* Enhanced shadow on hover */
// }

// /* Step indicator colors */
// .step-indicator-inner {
//     color: #6b7280 !important; /* Gray for inactive steps */
// }

// .step-indicator-inner.active {
//     color: #2563eb !important; /* Blue for active step */
// }

// .step-indicator-inner.complete {
//     color: #059669 !important; /* Green for completed steps */
// }

// /* Step number color */
// .step-number {
//     color: inherit !important;
// }

// /* Check icon color */
// .check-icon {
//     color: #ffffff !important; /* White check icon */
// }

// /* Step connector colors */
// .step-connector {
//     background-color: #d1d5db !important; /* Light gray for connector */
// }

// .step-connector-inner {
//     background-color: #2563eb !important; /* Blue for completed connector */
// } 
// .input{
//     border:2px solid rgb(127, 126, 126);
//     border-radius: 5px;
//     width: 100%;
// }
// .box_out{
//     width:100%;
//     display:flex;
//     flex-direction: row;
//     justify-content: center;
//     gap: 30px;
// }

// @import "tailwindcss";

// @layer utilities {
//   .scrollbar-hide {
//     -ms-overflow-style: none;
//     scrollbar-width: none;
//   }

//   .scrollbar-hide::-webkit-scrollbar {
//     display: none;
//   }
// }

// :root {
//   --background: oklch(1 0 0);
//   --foreground: oklch(0.145 0 0);
//   --card: oklch(1 0 0);
//   --card-foreground: oklch(0.145 0 0);
//   --popover: oklch(1 0 0);
//   --popover-foreground: oklch(0.145 0 0);
//   --primary: oklch(0.205 0 0);
//   --primary-foreground: oklch(0.985 0 0);
//   --secondary: oklch(0.97 0 0);
//   --secondary-foreground: oklch(0.205 0 0);
//   --muted: oklch(0.97 0 0);
//   --muted-foreground: oklch(0.556 0 0);
//   --accent: oklch(0.97 0 0);
//   --accent-foreground: oklch(0.205 0 0);
//   --destructive: oklch(0.577 0.245 27.325);
//   --destructive-foreground: oklch(0.577 0.245 27.325);
//   --border: oklch(0.922 0 0);
//   --input: oklch(0.922 0 0);
//   --ring: oklch(0.708 0 0);
//   --chart-1: oklch(0.646 0.222 41.116);
//   --chart-2: oklch(0.6 0.118 184.704);
//   --chart-3: oklch(0.398 0.07 227.392);
//   --chart-4: oklch(0.828 0.189 84.429);
//   --chart-5: oklch(0.769 0.188 70.08);
//   --radius: 0.625rem;
//   --sidebar: oklch(0.985 0 0);
//   --sidebar-foreground: oklch(0.145 0 0);
//   --sidebar-primary: oklch(0.205 0 0);
//   --sidebar-primary-foreground: oklch(0.985 0 0);
//   --sidebar-accent: oklch(0.97 0 0);
//   --sidebar-accent-foreground: oklch(0.205 0 0);
//   --sidebar-border: oklch(0.922 0 0);
//   --sidebar-ring: oklch(0.708 0 0);
// }

// .dark {
//   --background: oklch(0.145 0 0);
//   --foreground: oklch(0.985 0 0);
//   --card: oklch(0.145 0 0);
//   --card-foreground: oklch(0.985 0 0);
//   --popover: oklch(0.145 0 0);
//   --popover-foreground: oklch(0.985 0 0);
//   --primary: oklch(0.985 0 0);
//   --primary-foreground: oklch(0.205 0 0);
//   --secondary: oklch(0.269 0 0);
//   --secondary-foreground: oklch(0.985 0 0);
//   --muted: oklch(0.269 0 0);
//   --muted-foreground: oklch(0.708 0 0);
//   --accent: oklch(0.269 0 0);
//   --accent-foreground: oklch(0.985 0 0);
//   --destructive: oklch(0.396 0.141 25.723);
//   --destructive-foreground: oklch(0.637 0.237 25.331);
//   --border: oklch(0.269 0 0);
//   --input: oklch(0.269 0 0);
//   --ring: oklch(0.439 0 0);
//   --chart-1: oklch(0.488 0.243 264.376);
//   --chart-2: oklch(0.696 0.17 162.48);
//   --chart-3: oklch(0.769 0.188 70.08);
//   --chart-4: oklch(0.627 0.265 303.9);
//   --chart-5: oklch(0.645 0.246 16.439);
//   --sidebar: oklch(0.205 0 0);
//   --sidebar-foreground: oklch(0.985 0 0);
//   --sidebar-primary: oklch(0.488 0.243 264.376);
//   --sidebar-primary-foreground: oklch(0.985 0 0);
//   --sidebar-accent: oklch(0.269 0 0);
//   --sidebar-accent-foreground: oklch(0.985 0 0);
//   --sidebar-border: oklch(0.269 0 0);
//   --sidebar-ring: oklch(0.439 0 0);
// }

// @theme inline {
//   --color-background: var(--background);
//   --color-foreground: var(--foreground);
//   --color-card: var(--card);
//   --color-card-foreground: var(--card-foreground);
//   --color-popover: var(--popover);
//   --color-popover-foreground: var(--popover-foreground);
//   --color-primary: var(--primary);
//   --color-primary-foreground: var(--primary-foreground);
//   --color-secondary: var(--secondary);
//   --color-secondary-foreground: var(--secondary-foreground);
//   --color-muted: var(--muted);
//   --color-muted-foreground: var(--muted-foreground);
//   --color-accent: var(--accent);
//   --color-accent-foreground: var(--accent-foreground);
//   --color-destructive: var(--destructive);
//   --color-destructive-foreground: var(--destructive-foreground);
//   --color-border: var(--border);
//   --color-input: var(--input);
//   --color-ring: var(--ring);
//   --color-chart-1: var(--chart-1);
//   --color-chart-2: var(--chart-2);
//   --color-chart-3: var(--chart-3);
//   --color-chart-4: var(--chart-4);
//   --color-chart-5: var(--chart-5);
//   --radius-sm: calc(var(--radius) - 4px);
//   --radius-md: calc(var(--radius) - 2px);
//   --radius-lg: var(--radius);
//   --radius-xl: calc(var(--radius) + 4px);
//   --color-sidebar: var(--sidebar);
//   --color-sidebar-foreground: var(--sidebar-foreground);
//   --color-sidebar-primary: var(--sidebar-primary);
//   --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
//   --color-sidebar-accent: var(--sidebar-accent);
//   --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
//   --color-sidebar-border: var(--sidebar-border);
//   --color-sidebar-ring: var(--sidebar-ring);
// }

// @layer base {
//   * {
//     border-color: var(--color-border);
//     outline-color: color-mix(in srgb, var(--color-ring) 50%, transparent);
//   }
//   body {
//     background-color: var(--color-background);
//     color: var(--color-foreground);
//   }
// }

// .hover_effect{
//     border:1px solid black;
// }
// .my_button {
//   background: #6c63ff;
//   color: #fff;
//   border: none;
//   padding: 2px 5px;
//   border-radius: 8px;
//   cursor: pointer;
//   font-weight: 600;
//   margin-bottom: 12px;
//   transition: background 0.2s;
// }
// .my_button:hover {
//   background: #554ee2;
// }
// /*  */


// import React, { useState, useCallback, useEffect } from 'react';
// import Stepper, { Step } from '../Stepper/Stepper.jsx';
// import './Details.css';
// import DottedBackground from './Background';
// // import AnimatedModalDemo from './Animated-button-final';
// import GlareHover from '../GlareHover/GlareHover.jsx';
// import DualScrollPicker_weight from '../DualScrollPicker.jsx'; 
// import DualScrollPicker_Height from '../Dualscroll_height.jsx';
// import AgeScrollPicker from '../SingleScroll.jsx';
// import LiveLocationFinder from '../Location.jsx';
// import AnimatedList from '../AnimatedList/AnimatedList.jsx';
// import {useNavigate} from 'react-router-dom';

// export const Details = () => {
//     const navigate = useNavigate();
//     const [customTarget, setCustomTarget] = useState(false);
//     const [formData, setFormData] = useState({
//         name: '',
//         gender: null,
//         location: null,
//         weight: null,
//         height: null,
//         targetWeight: null,
//         age: null,
//         weightGoal: null,
//         activityLevel: '',
//         medicalDisabilities: ''
//     });

//     const handleWeightChange = useCallback((kg, decimal) => {
//         const combinedWeight = kg + decimal / 10;
//         setFormData(prevData => ({ ...prevData, weight: combinedWeight }));
//     }, []); 

//     const handleTargetWeightChange = useCallback((kg, decimal) => {
//         const combinedWeight = kg + decimal / 10;
//         setFormData(prevData => ({ ...prevData, targetWeight: combinedWeight }));
//     }, []);

//     const handleHeightChange = useCallback((cm, decimal) => {
//         const combinedHeight = cm + decimal / 10;
//         setFormData(prevData => ({ ...prevData, height: combinedHeight }));
//     }, []);

//     const handleAgeChange = useCallback((selectedAge) => {
//         setFormData(prevData => ({ ...prevData, age: selectedAge }));
//     }, []);

//     const calculateBMI = () => {
//         if (formData.weight && formData.height && formData.age) {
//             const heightInMeters = formData.height / 100;
//             const bmi = formData.weight / (heightInMeters * heightInMeters);
//             return bmi.toFixed(1);
//         }
//         return null;
//     };

//     const calculateHealthyWeightRange = () => {
//         if (formData.height && formData.age) {
//             const heightInMeters = formData.height / 100;
//             let minBMI = 18.5;
//             let maxBMI = 24.9;
//             if (formData.age < 18) {
//                 minBMI = 15; // Placeholder for younger individuals
//                 maxBMI = 25;
//             }
//             const minWeight = minBMI * (heightInMeters * heightInMeters);
//             const maxWeight = maxBMI * (heightInMeters * heightInMeters);
//             return {
//                 min: minWeight.toFixed(1),
//                 max: maxWeight.toFixed(1)
//             };
//         }
//         return null;
//     };

//     useEffect(() => {
//         const range = calculateHealthyWeightRange();
//         if (range && !customTarget && formData.weightGoal && formData.weight) {
//             let targetWeight;
//             if (formData.weightGoal === 'gain') {
//                 targetWeight = parseFloat(range.max);
//             } else if (formData.weightGoal === 'maintain') {
//                 targetWeight = formData.weight;
//             } else if (formData.weightGoal === 'lose') {
//                 targetWeight = parseFloat(range.min);
//             }
//             setFormData(prev => ({ ...prev, targetWeight }));
//         }
//     }, [formData.height, formData.age, formData.weight, formData.weightGoal, customTarget]);

//     return(
//         <div className="details-page-wrapper">
//             <DottedBackground>
//                 <Stepper initialStep={1} onFinalStepCompleted={async() => {
//                     console.log("Form Data Submitted:", formData);
//                     try {
//                         const token = localStorage.getItem('fitmate_token');
//                         if (!token) {
//                             alert('You must be logged in before submitting details. Please log in.');
//                             navigate('/login');
//                             return;
//                         }
//                         const dataToSubmit = {
//                             ...formData,
//                             bmi: calculateBMI()
//                         };

//                         const response = await fetch('http://localhost:5000/api/details/details_cu', {
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json',
//                                 'Authorization': `Bearer ${token}`
//                             },
//                             body: JSON.stringify(dataToSubmit)
//                         });

//                         const result = await response.json();

//                         if (!response.ok) {
//                             throw new Error(result.message || 'Failed to save details.');
//                         }

//                         console.log('Success:', result);
//                         alert('Your details have been saved successfully!');
//                         navigate("/dashboard");
//                     } catch (error) {
//                         console.error('Submission Error:', error);
//                         alert(`An error occurred: ${error.message}`);
//                     } 
//                     }}>
//                     <Step>
//                         <div className="step-content">
//                             <h3>Hey There 👋🏻!</h3>
//                             <p>We're happy that you've taken the first step towards a healthier you. We need a few details to kickstart your journey.</p>
//                             <br />
//                             <h3>What is your name?</h3>
//                             <input
//                                 type='name' 
//                                 placeholder='Enter your name' 
//                                 className='input'
//                                 value={formData.name}
//                                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                             />
//                         </div>
//                     </Step>
//                     <Step>
//                         <div className="step-content">
//                             <h3>What's your biological sex?</h3>
//                             <p>We support all forms of gender expression. However, we need this to calculate your body metrics.</p>
//                             <br />
//                             <div className="box_out">
//                                 <div style={{ display: 'flex', gap: '20px' }}>
//                                     <div 
//                                         style={{ 
//                                             border: formData.gender === 'male' ? '2px solid black' : '1px solid transparent',
//                                             borderRadius: '10px',
//                                             transition: 'border 0.2s ease'
//                                         }}
//                                         onClick={() => {
//                                             setFormData({ ...formData, gender: 'male' })
//                                         }}
//                                     >
//                                         <GlareHover 
//                                             children={'Male'} 
//                                             height='80px' 
//                                             width='100px' 
//                                             background={'rgb(215, 215, 215)'} 
//                                             borderColor='rgb(215,215,215)' 
//                                         />
//                                     </div>
//                                     <div 
//                                         style={{ 
//                                             border: formData.gender === 'female' ? '2px solid black' : '1px solid transparent',
//                                             borderRadius: '10px',
//                                             transition: 'border 0.2s ease'
//                                         }}
//                                         onClick={() => setFormData({ ...formData, gender: 'female' })}
//                                     >
//                                         <GlareHover 
//                                             children={'Female'} 
//                                             height='80px' 
//                                             width='100px' 
//                                             background={'rgb(215, 215, 215)'} 
//                                             borderColor='rgb(215,215,215)' 
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </Step>
//                     <Step>
//                         <div className="step-content">
//                             <LiveLocationFinder 
//                                 value={formData.location}
//                                 onChange={(newLocation) => {
//                                     setFormData({ ...formData, location: newLocation });
//                                 }}
//                             />
//                         </div>
//                     </Step>
//                     <Step>
//                         <div className="step-content">
//                             <h3>What's your current weight?</h3>
//                             <DualScrollPicker_weight onSelectionChange={handleWeightChange} />
//                         </div>
//                     </Step>
//                     <Step>
//                         <div className="step-content">
//                             <h3>What's your current Height?</h3>
//                             <DualScrollPicker_Height onSelectionChange={handleHeightChange} />
//                         </div>
//                     </Step>
//                     <Step>
//                         <div className="step-content">
//                             <h3>What's your current Age?</h3>
//                             <AgeScrollPicker onSelectionChange={handleAgeChange} />
//                         </div>
//                     </Step>
//                     <Step>
//                         <div className="step-content">
//                             <h3>What's your weight goal?</h3>
//                             <p>Select whether you want to gain, maintain, or lose weight.</p>
//                             <br />
//                             <div className="box_out">
//                                 <div style={{ display: 'flex', gap: '20px' }}>
//                                     <div 
//                                         style={{ 
//                                             border: formData.weightGoal === 'gain' ? '2px solid black' : '1px solid transparent',
//                                             borderRadius: '10px',
//                                             transition: 'border 0.2s ease'
//                                         }}
//                                         onClick={() => {
//                                             setFormData({ ...formData, weightGoal: 'gain' });
//                                             setCustomTarget(false);
//                                         }}
//                                     >
//                                         <GlareHover 
//                                             children={'Gain Weight'} 
//                                             height='80px' 
//                                             width='120px' 
//                                             background={'rgb(215, 215, 215)'} 
//                                             borderColor='rgb(215,215,215)' 
//                                         />
//                                     </div>
//                                     <div 
//                                         style={{ 
//                                             border: formData.weightGoal === 'maintain' ? '2px solid black' : '1px solid transparent',
//                                             borderRadius: '10px',
//                                             transition: 'border 0.2s ease'
//                                         }}
//                                         onClick={() => {
//                                             setFormData({ ...formData, weightGoal: 'maintain' });
//                                             setCustomTarget(false);
//                                         }}
//                                     >
//                                         <GlareHover 
//                                             children={'Maintain Weight'} 
//                                             height='80px' 
//                                             width='120px' 
//                                             background={'rgb(215, 215, 215)'} 
//                                             borderColor='rgb(215,215,215)' 
//                                         />
//                                     </div>
//                                     <div 
//                                         style={{ 
//                                             border: formData.weightGoal === 'lose' ? '2px solid black' : '1px solid transparent',
//                                             borderRadius: '10px',
//                                             transition: 'border 0.2s ease'
//                                         }}
//                                         onClick={() => {
//                                             setFormData({ ...formData, weightGoal: 'lose' });
//                                             setCustomTarget(false);
//                                         }}
//                                     >
//                                         <GlareHover 
//                                             children={'Lose Weight'} 
//                                             height='80px' 
//                                             width='120px' 
//                                             background={'rgb(215, 215, 215)'} 
//                                             borderColor='rgb(215,215,215)' 
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </Step>
//                     <Step>
//                         <div className="step-content">
//                             <h3>Your BMI and Target Weight</h3>
//                             <p>Your Body Mass Index (BMI) is calculated based on your age, height, and weight.</p>
//                             <br />
//                             {calculateBMI() ? (
//                                 <div>
//                                     <h4>Your BMI: {calculateBMI()}</h4>
//                                     <p>
//                                         {parseFloat(calculateBMI()) < 18.5 ? "Underweight" :
//                                          parseFloat(calculateBMI()) < 25 ? "Normal weight" :
//                                          parseFloat(calculateBMI()) < 30 ? "Overweight" :
//                                          "Obese"}
//                                     </p>
//                                     {calculateHealthyWeightRange() && (
//                                         <div>
//                                             <p>Suggested healthy weight range: <strong>{calculateHealthyWeightRange().min} - {calculateHealthyWeightRange().max} kg</strong></p>
//                                             <p>Your target weight is set to {formData.targetWeight} kg based on your goal to {formData.weightGoal} weight.</p>
//                                             {!customTarget && (
//                                                 <button className="my_button" onClick={() => setCustomTarget(true)}>
//                                                     Set your own target weight
//                                                 </button>
//                                             )}
//                                             {customTarget && (
//                                                 <div>
//                                                     <button className="my_button">
//                                                         Select your target weight
//                                                     </button>
//                                                     <DualScrollPicker_weight onSelectionChange={handleTargetWeightChange} />
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <p>Please provide age, height, and weight to calculate BMI.</p>
//                             )}
//                         </div>
//                     </Step>
//                     <Step>
//                         <div className="step-content">
//                             <h3>How active are you?</h3>
//                             <p>Based on your lifestyle, we can assess your daily calorie requirements.</p>
//                             <div>
//                                 <AnimatedList showGradients={false} displayScrollbar={false} items={[
//                                         "Mostly Sitting Seated work, low movement.",
//                                         "Often Standing Standing work, occasional walking.",
//                                         "Regularly Walking Frequent walking, steady activity.",
//                                         "Physically Intense Work Heavy labor, high exertion."
//                                     ]}  
//                                     onItemSelect={(selectedActivity, index) => {
//                                         setFormData(prevData => ({
//                                             ...prevData,
//                                             activityLevel: selectedActivity
//                                         }));
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                     </Step>
//                     <Step>
//                         <div className="step-content">
//                             <h3>Medical disabilities</h3>
//                             <input 
//                                 type='text' 
//                                 placeholder='Enter your Disabilities' 
//                                 className='input'
//                                 value={formData.medicalDisabilities}
//                                 onChange={(e) => setFormData({ ...formData, medicalDisabilities: e.target.value })}
//                             />
//                         </div>
//                     </Step>
//                 </Stepper>
//             </DottedBackground>
//         </div>
//     );
// }


// /* Details page theme: brown + peach to match dashboard/profile */

// /* Page background and font */
// body, .step-content, .step-circle-container {
//   font-family: Alkatra, sans-serif;
// }

// .step-content {
//   background-color: transparent;
//   color: #492110; /* brown text for step content */
// }

// .step-circle-container {
//   background-color: #fff !important;
//   border: 6px solid #492110 !important; /* thicker brown border */
//   box-shadow: 0 12px 24px rgba(0,0,0,0.08);
// }

// .step-content h3 {
//   color: #492110; /* brown headings */
//   margin-bottom: 1rem;
// }

// .step-content p {
//   color: #6b6b6b; /* muted brownish gray */
//   line-height: 1.6;
// }

// /* Buttons styled to match theme */
// .back-button {
//   color: #6b6b6b !important;
// }
// .back-button:hover { color: #492110 !important; }
// .next-button {
//   color: #fff !important;
//   background-color: #492110 !important; /* brown */
//   box-shadow: 0 6px 10px rgba(73,33,16,0.18) !important;
// }
// .next-button:hover { background-color: #3c1f12 !important; }

// /* Step indicators */
// .step-indicator-inner { color: #6b6b6b !important; }
// .step-indicator-inner.active { color: #492110 !important; }
// .step-indicator-inner.complete { color: #2f6f3b !important; }

// .step-connector { background-color: #e6dcd6 !important; }
// .step-connector-inner { background-color: #492110 !important; }

// .input{
//     border:2px solid #7f7e7e;
//     border-radius: 5px;
//     width: 100%;
//     padding: 8px;
// }
// .box_out{
//     width:100%;
//     display:flex;
//     flex-direction: row;
//     justify-content: center;
//     gap: 30px;
// }

// /* Utility button styles used by Details */
// .my_button {
//   background: #492110;
//   color: #FFE8D6;
//   border: none;
//   padding: 8px 12px;
//   border-radius: 8px;
//   cursor: pointer;
//   font-weight: 600;
//   margin-bottom: 12px;
//   transition: background 0.15s;
// }
// .my_button:hover { background: #3c1f12; }

// /* Make overall page area match peach background when rendered inside components */
// /* .details-page-wrapper {
//   background-color: #FFE8D6;
//   padding: 24px;
// } */