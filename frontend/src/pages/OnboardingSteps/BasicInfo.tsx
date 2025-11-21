import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';

export default function BasicInfo() {
	const navigate = useNavigate();
	const { userData, updateUserData } = useOnboarding();

	// Prefill if user goes back
	const [firstname, setFirstName] = useState(userData.firstname || '');
	const [lastname, setLastName] = useState(userData.lastname || '');
	const [birthDate, setBirthDate] = useState(userData.birthDate || '');
	const [gender, setGender] = useState(userData.gender || '');

	const handleNext = async () => {
		if (!firstname.trim() || !lastname.trim() || !birthDate || !gender) {
			alert('Please fill out all fields.');
			return;
		}

		// Update Context
		updateUserData({
			firstname,
			lastname,
			birthDate,
			gender,
		});

		// Save User immediately (required for generating plan)

		navigate('/onboarding/experience');
	};

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Basic Information</h2>
			<p className="text-gray-600 mb-6">Please enter some personal information about yourself.</p>

			{/* Firstname */}
			<p className="mb-2 font-medium">Firstname</p>
			<input
				type="text"
				placeholder="Firstname"
				value={firstname}
				onChange={(e) => setFirstName(e.target.value)}
				className="border p-2 rounded w-full mb-4"
			/>

			{/* Lastname */}
			<p className="mb-2 font-medium">Lastname</p>
			<input
				type="text"
				placeholder="Lastname"
				value={lastname}
				onChange={(e) => setLastName(e.target.value)}
				className="border p-2 rounded w-full mb-4"
			/>

			{/* Birthdate */}
			<p className="mb-2 font-medium">Birthdate</p>
			<input
				type="date"
				value={birthDate}
				onChange={(e) => setBirthDate(e.target.value)}
				className="border p-2 rounded w-full mb-4"
			/>

			{/* Gender */}
			<div className="mb-4">
				<p className="mb-2 font-medium">Gender</p>

				<div className="flex gap-2">
					{['Male', 'Female', 'Diverse'].map((g) => (
						<button
							key={g}
							onClick={() => setGender(g)}
							className={`
                px-4 py-2 rounded border transition
                ${
									gender === g
										? 'bg-indigo-600 text-white border-indigo-600'
										: 'border-gray-300 hover:bg-gray-100'
								}
              `}
						>
							{g}
						</button>
					))}
				</div>
			</div>

			<div className="flex justify-between mt-6">
				<button onClick={() => navigate('/onboarding')} className="px-4 py-2 border rounded">
					Back
				</button>

				<button onClick={handleNext} className="px-4 py-2 bg-indigo-600 text-white rounded">
					Continue
				</button>
			</div>
		</div>
	);
}
