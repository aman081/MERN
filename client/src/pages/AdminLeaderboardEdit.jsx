import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';

const ALL_BRANCHES = ['CSE', 'ECE', 'CE', 'ME', 'EE', 'MME', 'PIE+ECM'];

const AdminLeaderboardEdit = () => {
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState('');
  const [leaderboardSuccess, setLeaderboardSuccess] = useState('');
  const [manualPoints, setManualPoints] = useState(() => Object.fromEntries(ALL_BRANCHES.map(b => [b, 0])));
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState('');
  const [manualSuccess, setManualSuccess] = useState('');
  const [manualMedals, setManualMedals] = useState(() => Object.fromEntries(ALL_BRANCHES.map(b => [b, { firstCount: 0, secondCount: 0, thirdCount: 0 }])));
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/leaderboard');
        const points = Object.fromEntries(ALL_BRANCHES.map(b => [b, 0]));
        const medals = Object.fromEntries(ALL_BRANCHES.map(b => [b, { firstCount: 0, secondCount: 0, thirdCount: 0 }]));
        res.data.data.forEach(row => {
          points[row.branch] = row.points;
          medals[row.branch] = {
            firstCount: row.firstCount || 0,
            secondCount: row.secondCount || 0,
            thirdCount: row.thirdCount || 0
          };
        });
        setManualPoints(points);
        setManualMedals(medals);
      } catch {}
    })();
  }, []);

  const handleClearLeaderboard = async () => {
    setLeaderboardLoading(true);
    setLeaderboardError('');
    setLeaderboardSuccess('');
    try {
      await api.post('/leaderboard/clear');
      setLeaderboardSuccess('Leaderboard cleared. All branch points set to 0.');
      setManualPoints(Object.fromEntries(ALL_BRANCHES.map(b => [b, 0])));
    } catch (err) {
      setLeaderboardError(err.response?.data?.message || 'Failed to clear leaderboard.');
    }
    setLeaderboardLoading(false);
  };

  const handleManualPointsChange = (branch, value) => {
    setManualPoints(mp => ({ ...mp, [branch]: value === '' ? '' : Number(value) }));
  };

  const handleManualMedalsChange = (branch, field, value) => {
    setManualMedals(mm => ({
      ...mm,
      [branch]: {
        ...mm[branch],
        [field]: value === '' ? '' : Number(value)
      }
    }));
  };

  const handleManualPointsSubmit = async () => {
    setManualLoading(true);
    setManualError('');
    setManualSuccess('');
    try {
      await Promise.all(ALL_BRANCHES.map(async branch => {
        await api.patch('/leaderboard/manual', {
          branch,
          points: manualPoints[branch],
          firstCount: manualMedals[branch].firstCount,
          secondCount: manualMedals[branch].secondCount,
          thirdCount: manualMedals[branch].thirdCount
        });
      }));
      setManualSuccess('Leaderboard points and medals updated.');
    } catch (err) {
      setManualError(err.response?.data?.message || 'Failed to update leaderboard points and medals.');
    }
    setManualLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Leaderboard</h2>
      <div className="mb-4 text-gray-700 dark:text-gray-200">You can clear the leaderboard to reset all branch points to 0. This action cannot be undone.</div>
      {leaderboardError && <div className="text-red-600 font-semibold mb-2">{leaderboardError}</div>}
      {leaderboardSuccess && <div className="text-green-600 font-semibold mb-2">{leaderboardSuccess}</div>}
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="secondary" onClick={() => navigate('/admin')}>Back</Button>
        <Button variant="danger" loading={leaderboardLoading} onClick={handleClearLeaderboard}>Clear Leaderboard</Button>
      </div>
      <hr className="my-6" />
      <div className="mb-2 font-semibold">Manually Set Points</div>
      <form onSubmit={e => { e.preventDefault(); handleManualPointsSubmit(); }} className="space-y-2">
        {ALL_BRANCHES.map(branch => (
          <div key={branch} className="flex items-center gap-2">
            <label className="w-24">{branch}</label>
            <input
              className="input w-24"
              type="number"
              value={manualPoints[branch]}
              onChange={e => handleManualPointsChange(branch, e.target.value)}
              min={0}
              step={0.1}
            />
            <input
              className="input w-16"
              type="number"
              value={manualMedals[branch].firstCount}
              onChange={e => handleManualMedalsChange(branch, 'firstCount', e.target.value)}
              min={0}
              placeholder="Gold"
              title="Gold medals"
            />
            <input
              className="input w-16"
              type="number"
              value={manualMedals[branch].secondCount}
              onChange={e => handleManualMedalsChange(branch, 'secondCount', e.target.value)}
              min={0}
              placeholder="Silver"
              title="Silver medals"
            />
            <input
              className="input w-16"
              type="number"
              value={manualMedals[branch].thirdCount}
              onChange={e => handleManualMedalsChange(branch, 'thirdCount', e.target.value)}
              min={0}
              placeholder="Bronze"
              title="Bronze medals"
            />
          </div>
        ))}
        {manualError && <div className="text-red-600 font-semibold mb-2">{manualError}</div>}
        {manualSuccess && <div className="text-green-600 font-semibold mb-2">{manualSuccess}</div>}
        <div className="flex gap-2 justify-end mt-4">
          <Button type="submit" variant="primary" loading={manualLoading}>Save Points</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminLeaderboardEdit; 