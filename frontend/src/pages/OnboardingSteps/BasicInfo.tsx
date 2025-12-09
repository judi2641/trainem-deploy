import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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

		navigate('/onboarding/experience');
	};

	return (
		<div className="relative">
			{/* Avatar rechts oben */}
			<div className="absolute right-4 top-0 w-25 opacity-95 pointer-events-none">
				<img
					src="/assets/avatar/onboarding/AvatarBasicInfoOnboarding.png"
					alt="Onboarding Avatar"
					className="w-full h-auto"
				/>
			</div>

			<h2 className="text-xl font-bold mb-4">Basic Information</h2>
			<p className="text-gray-600 mb-6">Please enter some personal information about yourself.</p>

			{/* Firstname */}
			<p className="mb-2 font-medium">Firstname</p>
			<Input
				placeholder="..."
				value={firstname}
				onChange={(e) => setFirstName(e.target.value)}
				className="mb-4"
			/>

			{/* Lastname */}
			<p className="mb-2 font-medium">Lastname</p>
			<Input
				placeholder="...."
				value={lastname}
				onChange={(e) => setLastName(e.target.value)}
				className="mb-4"
			/>

			{/* Birthdate */}
			<div className="mb-4">
				<p className="mb-2 font-medium">Birthdate</p>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={`w-full justify-start font-normal ${
								!birthDate ? 'text-muted-foreground' : 'text-foreground'
							}`}
						>
							{birthDate ? format(new Date(birthDate), 'dd.MM.yyyy') : 'Select date'}
						</Button>
					</PopoverTrigger>

					<PopoverContent className="p-0 w-[350px] min-h-[380px]">
						<Calendar
							mode="single"
							captionLayout="dropdown"
							className="w-full"
							selected={birthDate ? new Date(birthDate) : undefined}
							onSelect={(value) => value && setBirthDate(value.toISOString().split('T')[0])}
						/>
					</PopoverContent>
				</Popover>
			</div>

			{/* Gender */}
			<div className="mb-4">
				<p className="mb-2 font-medium">Gender</p>
				<div className="flex gap-4 justify-center mt-4">
					{['Male', 'Female', 'Diverse'].map((g) => (
						<Button
							key={g}
							variant={gender === g ? 'default' : 'outline'}
							onClick={() => setGender(g)}
							className={`
              px-8 py-3 text-lg rounded-lg transition
              ${gender === g ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300'}
            `}
						>
							{g}
						</Button>
					))}
				</div>
			</div>

			{/* Navigation */}
			<div className="flex justify-between mt-6">
				<Button
					onClick={() => navigate('/onboarding')}
					variant="outline"
					className="h-11 w-11 p-0 flex items-center justify-center"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>

				<Button
					onClick={handleNext}
					className="h-11 w-11 p-0 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
				>
					<ArrowRight className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
