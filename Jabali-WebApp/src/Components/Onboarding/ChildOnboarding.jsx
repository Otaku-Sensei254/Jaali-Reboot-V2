import React, { useState } from 'react';
import { useChild } from '../Context/useChild';
import { useLanguage } from '../Context/LanguageContext';
import './ChildOnboarding.css';

const sensoryOptions = [
  { id: 'brightLight', label: 'Bright lights', icon: '☀️' },
  { id: 'loudSounds', label: 'Loud sounds', icon: '🔊' },
  { id: 'busySpaces', label: 'Busy spaces', icon: '👥' },
  { id: 'unexpectedTouch', label: 'Unexpected touch', icon: '🫳' },
];

const regulationOptions = [
  'Changes in routine',
  'Waiting or transitions',
  'Feeling frustrated',
  'Big emotions',
  'None that stand out',
];

const interestOptions = ['Animals', 'Art', 'Music', 'Nature', 'Numbers', 'Stories', 'Trains', 'Space'];
const learningOptions = ['Visual examples', 'Short, focused activities', 'Hands-on play', 'Gentle audio', 'Clear routines'];

const ChildOnboarding = ({ onComplete }) => {
  const { addChild, setSelectedChild } = useChild();
  const { language, toggleLanguage } = useLanguage();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    age: '',
    supportLevel: 'moderate',
    sensoryNeeds: [],
    regulationNeeds: [],
    interests: [],
    learningPreferences: [],
  });
  const isSwahili = language === 'sw';
  const optionText = isSwahili ? {
    brightLight: 'Mwanga mkali', loudSounds: 'Sauti kubwa', busySpaces: 'Maeneo yenye watu wengi', unexpectedTouch: 'Kuguswa bila kutarajia',
    regulation: ['Mabadiliko ya ratiba', 'Kusubiri au kubadilisha shughuli', 'Kuhisi kuchanganyikiwa', 'Hisia kubwa', 'Hakuna kinachojitokeza'],
    interests: ['Wanyama', 'Sanaa', 'Muziki', 'Asili', 'Namba', 'Hadithi', 'Treni', 'Anga'],
    learning: ['Mifano ya kuona', 'Shughuli fupi zenye umakini', 'Kujifunza kwa vitendo', 'Sauti tulivu', 'Ratiba zilizo wazi'],
  } : null;
  const text = isSwahili ? {
    step: 'Hatua', of: 'ya', back: 'Rudi', continue: 'Endelea', save: 'Anza kujifunza', saving: 'Inahifadhi wasifu…',
    basicsTitle: 'Tujifunze kuhusu mtoto wako', basicsBody: 'Maelezo haya hutusaidia kuchagua shughuli zinazomfaa. Unaweza kuyabadilisha wakati wowote.', name: 'Jina la kwanza la mtoto', age: 'Umri', support: 'Ni msaada kiasi gani huwa wa manufaa?',
    little: 'Msaada kidogo', regular: 'Msaada wa mara kwa mara', consistent: 'Msaada wa kudumu zaidi', unsure: 'Bado sina uhakika',
    sensoryTitle: 'Ni nini kinaweza kumlemea?', sensoryBody: 'Chagua chochote ambacho mtoto wako anaweza kukisikia kwa urahisi. Ni sawa kabisa kuacha sehemu hii wazi.',
    regulationTitle: 'Ni msaada gani husaidia siku ngumu?', regulationBody: 'Hii hutusaidia kupendekeza ratiba tulivu, shughuli zinazotabirika na mapumziko yanayofaa.',
    interestsTitle: 'Mtoto wako anapenda nini?', interestsBody: 'Chagua mambo anayopenda na mitindo ya kujifunza ili mapendekezo ya kwanza yawe ya kufahamika.', interests: 'Mambo anayopenda', preferences: 'Mapendeleo ya kujifunza', required: 'Tafadhali tuambie jina na umri wa mtoto wako ili uendelee.', saveError: 'Hatukuweza kuhifadhi wasifu huu. Tafadhali jaribu tena.', language: 'EN',
  } : {
    step: 'Step', of: 'of', back: 'Back', continue: 'Continue', save: 'Start exploring', saving: 'Saving profile…',
    basicsTitle: 'Let’s get to know your child', basicsBody: 'These details help us tailor activities. You can update them any time.', name: 'Child’s first name', age: 'Age', support: 'How much support is usually helpful?',
    little: 'A little support', regular: 'Some regular support', consistent: 'More consistent support', unsure: 'I’m not sure yet',
    sensoryTitle: 'What can feel overwhelming?', sensoryBody: 'Select anything your child may be sensitive to. It’s completely okay to leave this blank.',
    regulationTitle: 'What support helps on harder days?', regulationBody: 'This helps us favour calm pacing, predictable activities, and appropriate breaks.',
    interestsTitle: 'What does your child enjoy?', interestsBody: 'Choose a few interests and learning styles to make the first recommendations feel more familiar.', interests: 'Interests', preferences: 'Learning preferences', required: 'Please tell us your child\'s name and age to continue.', saveError: 'We could not save this profile. Please try again.', language: 'SW',
  };

  const toggleValue = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
  };

  const continueToNextStep = () => {
    if (step === 1 && (!form.name.trim() || !form.age)) {
      setError(text.required);
      return;
    }
    setError('');
    setStep((current) => Math.min(current + 1, 4));
  };

  const completeOnboarding = async () => {
    setSubmitting(true);
    setError('');
    try {
      const child = await addChild({
        name: form.name.trim(),
        age: Number(form.age),
        supportLevel: form.supportLevel,
        interests: form.interests,
        learningPreferences: {
          sensoryNeeds: form.sensoryNeeds,
          regulationNeeds: form.regulationNeeds,
          learningPreferences: form.learningPreferences,
        },
      });
      setSelectedChild(child);
      onComplete();
    } catch (requestError) {
      setError(requestError.response?.data?.error || text.saveError);
      setSubmitting(false);
    }
  };

  return (
    <main className="onboarding-page">
      <section className="onboarding-card" aria-labelledby="onboarding-title">
        <div className="onboarding-progress" aria-label={`Step ${step} of 4`}>
          {[1, 2, 3, 4].map((number) => <span key={number} className={number <= step ? 'active' : ''} />)}
        </div>
        <button type="button" className="onboarding-language-toggle" onClick={toggleLanguage}>{text.language}</button>
        <p className="onboarding-step">{text.step} {step} {text.of} 4</p>

        {step === 1 && <>
          <span className="onboarding-emoji">👋</span>
          <h1 id="onboarding-title">{text.basicsTitle}</h1>
          <p>{text.basicsBody}</p>
          <div className="onboarding-fields">
            <label>{text.name}<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Amani" autoFocus /></label>
            <label>{text.age}<input value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} type="number" min="1" max="25" placeholder="e.g. 7" /></label>
            <label>{text.support}
              <select value={form.supportLevel} onChange={(event) => setForm({ ...form, supportLevel: event.target.value })}>
                <option value="mild">{text.little}</option><option value="moderate">{text.regular}</option><option value="substantial">{text.consistent}</option><option value="other">{text.unsure}</option>
              </select>
            </label>
          </div>
        </>}

        {step === 2 && <>
          <span className="onboarding-emoji">🌿</span>
          <h1 id="onboarding-title">{text.sensoryTitle}</h1><p>{text.sensoryBody}</p>
          <div className="onboarding-options sensory-options">
            {sensoryOptions.map((option) => <button type="button" key={option.id} onClick={() => toggleValue('sensoryNeeds', option.id)} className={form.sensoryNeeds.includes(option.id) ? 'selected' : ''}><span>{option.icon}</span>{optionText?.[option.id] || option.label}</button>)}
          </div>
        </>}

        {step === 3 && <>
          <span className="onboarding-emoji">💛</span>
          <h1 id="onboarding-title">{text.regulationTitle}</h1><p>{text.regulationBody}</p>
          <div className="onboarding-options">
            {regulationOptions.map((option, index) => <button type="button" key={option} onClick={() => toggleValue('regulationNeeds', option)} className={form.regulationNeeds.includes(option) ? 'selected' : ''}>{optionText?.regulation[index] || option}</button>)}
          </div>
        </>}

        {step === 4 && <>
          <span className="onboarding-emoji">✨</span>
          <h1 id="onboarding-title">{isSwahili ? `Mtoto wako ${form.name || ''} anapenda nini?` : `What does ${form.name || 'your child'} enjoy?`}</h1><p>{text.interestsBody}</p><h2>{text.interests}</h2>
          <div className="onboarding-options compact-options">
            {interestOptions.map((option, index) => <button type="button" key={option} onClick={() => toggleValue('interests', option)} className={form.interests.includes(option) ? 'selected' : ''}>{optionText?.interests[index] || option}</button>)}
          </div>
          <h2>{text.preferences}</h2>
          <div className="onboarding-options compact-options">
            {learningOptions.map((option, index) => <button type="button" key={option} onClick={() => toggleValue('learningPreferences', option)} className={form.learningPreferences.includes(option) ? 'selected' : ''}>{optionText?.learning[index] || option}</button>)}
          </div>
        </>}

        {error && <p className="onboarding-error" role="alert">{error}</p>}
        <div className="onboarding-actions">
          {step > 1 && <button type="button" className="back-button" onClick={() => setStep((current) => current - 1)}>{text.back}</button>}
          {step < 4 ? <button type="button" className="next-button" onClick={continueToNextStep}>{text.continue}</button> : <button type="button" className="next-button" onClick={completeOnboarding} disabled={submitting}>{submitting ? text.saving : text.save}</button>}
        </div>
      </section>
    </main>
  );
};

export default ChildOnboarding;
