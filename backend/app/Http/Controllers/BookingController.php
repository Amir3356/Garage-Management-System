<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return response()->json(
                Booking::with(['user', 'vehicle', 'service', 'mechanic'])->get()
            );
        }

        if ($user->isMechanic()) {
            return response()->json(
                Booking::with(['user', 'vehicle', 'service', 'mechanic'])
                    ->where('assigned_mechanic_id', $user->id)
                    ->get()
            );
        }

        return response()->json(
            Booking::with(['vehicle', 'service', 'mechanic'])
                ->where('user_id', $user->id)
                ->get()
        );
    }

    public function show(Request $request, Booking $booking)
    {
        $user = $request->user();

        if (!$user->isAdmin() && 
            $booking->user_id !== $user->id && 
            $booking->assigned_mechanic_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($booking->load(['user', 'vehicle', 'service', 'mechanic']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'service_id' => 'required|exists:services,id',
            'scheduled_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'vehicle_id' => $request->vehicle_id,
            'service_id' => $request->service_id,
            'status' => 'pending',
            'notes' => $request->notes,
            'scheduled_date' => $request->scheduled_date,
        ]);

        return response()->json($booking->load(['vehicle', 'service']), 201);
    }

    public function update(Request $request, Booking $booking)
    {
        $user = $request->user();

        if ($user->isClient() && $booking->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->isMechanic() && $booking->assigned_mechanic_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'sometimes|in:pending,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
            'scheduled_date' => 'nullable|date',
        ]);

        $data = $request->only(['status', 'notes', 'scheduled_date']);

        if ($request->status === 'completed') {
            $data['completed_at'] = now();
        }

        $booking->update($data);

        return response()->json($booking->load(['user', 'vehicle', 'service', 'mechanic']));
    }

    public function assignMechanic(Request $request, Booking $booking)
    {
        $request->validate([
            'mechanic_id' => 'required|exists:users,id',
        ]);

        $mechanic = \App\Models\User::find($request->mechanic_id);

        if (!$mechanic->isMechanic()) {
            return response()->json(['message' => 'Selected user is not a mechanic'], 422);
        }

        $booking->update([
            'assigned_mechanic_id' => $request->mechanic_id,
            'status' => 'in_progress',
        ]);

        return response()->json($booking->load(['user', 'vehicle', 'service', 'mechanic']));
    }

    public function destroy(Request $request, Booking $booking)
    {
        if (!$request->user()->isAdmin() && $booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }

    public function stats()
    {
        return response()->json([
            'total' => Booking::count(),
            'pending' => Booking::pending()->count(),
            'in_progress' => Booking::inProgress()->count(),
            'completed' => Booking::completed()->count(),
            'revenue' => Booking::completed()
                ->join('services', 'bookings.service_id', '=', 'services.id')
                ->sum('services.price'),
        ]);
    }
}
