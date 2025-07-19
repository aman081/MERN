import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import Button from '../components/UI/Button';

const AdminEventConclude = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, addWinners, fetchEvents } = useEvents();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState([]);
  const [winnerLoading, setWinnerLoading] = useState(false);
  const [winnerError, setWinnerError] = useState('');
  const [result, setResult] = useState('');

  const ALL_BRANCHES = ['CSE', 'ECE', 'CE', 'ME', 'EE', 'MME', 'PIE+ECM'];

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const ev = await getEvent(id);
      setEvent(ev);
      if (ev) {
        setWinners([
          { position: 'First', branch: '', points: undefined, playerOfTheMatch: '' },
          { position: 'Second', branch: '', points: undefined },
          { position: 'Third', branch: '', points: undefined }
        ]);
      }
      setLoading(false);
    };
    fetchEvent();
    // eslint-disable-next-line
  }, [id]);

  const handleWinnerChange = (idx, field, value) => {
    setWinners(ws => ws.map((w, i) => i === idx ? { ...w, [field]: value } : w));
  };

  const isWinnersValid = () => {
    if (!event) return false;
    return winners[0].branch;
  };

  // Add this function to refetch leaderboard after concluding
  const fetchLeaderboard = async () => {
    try {
      await fetch('/api/leaderboard'); // Fire-and-forget, or you can store in state/context if needed
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWinnerLoading(true);
    setWinnerError('');
    if (!isWinnersValid()) {
      setWinnerError('Please fill all winner fields before saving.');
      setWinnerLoading(false);
      return;
    }
    const payload = { winners, result };
    const res = await addWinners(id, payload);
    if (!res.success) {
      setWinnerError(res.error || 'Failed to save winners.');
      setWinnerLoading(false);
      return;
    }
    fetchEvents();
    await fetchLeaderboard();
    navigate('/admin');
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!event) return <div className="text-center py-12 text-red-600 font-semibold">Event not found or data incomplete.</div>;
  if (!event.eventType || !event.branchTags || !event.points) {
    return <div className="text-center py-12 text-red-600 font-semibold">Event data is incomplete. Please check event details before concluding.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Conclude Event: {event.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[0, 1, 2].map(idx => (
          <div key={idx} className="space-y-2">
            <label className="block text-sm font-medium mb-1">
              {['First', 'Second', 'Third'][idx]} Branch {idx === 0 ? <span className='text-red-600'>*</span> : <span className='text-gray-400'>(optional)</span>}
            </label>
            <select
              className="input"
              value={winners[idx]?.branch || ''}
              onChange={e => handleWinnerChange(idx, 'branch', e.target.value)}
              required={idx === 0}
            >
              <option value="">Select branch</option>
              {ALL_BRANCHES.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <label className="block text-xs font-medium mb-1">Points <span className='text-gray-400'>(optional)</span></label>
            <input
              className="input"
              type="number"
              placeholder={`Points for ${['1st', '2nd', '3rd'][idx]}`}
              value={winners[idx]?.points ?? ''}
              onChange={e => handleWinnerChange(idx, 'points', e.target.value ? Number(e.target.value) : undefined)}
            />
            {idx === 0 && <>
              <label className="block text-xs font-medium mb-1">Player of the Match (optional)</label>
              <input className="input" placeholder="Player of the Match" value={winners[0]?.playerOfTheMatch || ''} onChange={e => handleWinnerChange(0, 'playerOfTheMatch', e.target.value)} />
            </>}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">Result <span className='text-gray-400'>(e.g. "CSE win by 10 runs")</span></label>
          <input
            className="input"
            placeholder="Enter event result (optional)"
            value={result}
            onChange={e => setResult(e.target.value)}
          />
        </div>
        {winnerError && <div className="text-red-600 text-sm font-semibold">{winnerError}</div>}
        <div className="flex gap-2 justify-end mt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin')}>Cancel</Button>
          <Button type="submit" variant="primary" loading={winnerLoading} disabled={!isWinnersValid()}>Save Winners</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventConclude; 