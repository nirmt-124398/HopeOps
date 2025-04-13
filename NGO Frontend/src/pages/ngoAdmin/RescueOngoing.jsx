const RescueOngoing = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Ongoing Rescue Operations</h2>
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Under Development</p>
        <p className="text-sm text-gray-500">
          This section will display rescue operations that your NGO is currently handling.
          Data will be loaded from /api/emergency/ngo/ongoing
        </p>
      </div>
    </div>
  );
};

export default RescueOngoing; 