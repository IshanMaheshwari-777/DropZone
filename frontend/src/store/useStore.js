import { create } from 'zustand';
import api from '../utils/api';
import { toast } from 'sonner';

const useStore = create((set, get) => ({
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: false,

    // Found Items State
    foundItems: [],
    foundItem: null,
    foundLoading: false,

    // Lost Items State
    lostItems: [],
    lostItem: null,
    myLostItems: [],
    lostLoading: false,

    // Auth Actions
    login: async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            set({ user: res.data, token: res.data.token, isAuthenticated: true });
            toast.success('Logged in successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    },

    register: async (name, email, password) => {
        try {
            const res = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', res.data.token);
            set({ user: res.data, token: res.data.token, isAuthenticated: true });
            toast.success('Registered successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
        toast.message('Logged out');
    },

    checkAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
            set({ isAuthenticated: true, token });
            // Optionally fetch user profile if endpoint exists
        }
    },

    // Found Items Actions
    fetchFoundItems: async (category) => {
        set({ foundLoading: true });
        try {
            const query = category ? `?category=${category}` : '';
            const res = await api.get(`/found${query}`);
            set({ foundItems: res.data.data || [] });
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch found items');
        } finally {
            set({ foundLoading: false });
        }
    },

    fetchFoundItemById: async (id) => {
        set({ foundLoading: true });
        try {
            const res = await api.get(`/found/${id}`);
            set({ foundItem: res.data });
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch item details');
        } finally {
            set({ foundLoading: false });
        }
    },

    createFoundItem: async (formData) => {
        set({ foundLoading: true });
        try {
            // formData handling for file upload must be done in component, passing FormData object here?
            // Axios handles FormData automatically if passed directly
            await api.post('/found', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Found item reported successfully');
            get().fetchFoundItems(); // Refresh list
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to report item');
            return false;
        } finally {
            set({ foundLoading: false });
        }
    },

    claimFoundItem: async (id) => {
        try {
            const res = await api.patch(`/found/${id}/claim`);
            set((state) => ({
                foundItems: state.foundItems.map(item => item._id === id ? { ...item, status: 'claimed' } : item),
                foundItem: state.foundItem?._id === id ? { ...state.foundItem, status: 'claimed' } : state.foundItem
            }));
            toast.success('Item marked as claimed');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to claim item');
        }
    },

    deleteFoundItem: async (id) => {
        try {
            await api.delete(`/found/${id}`);
            set((state) => ({
                foundItems: state.foundItems.filter(item => item._id !== id),
                foundItem: null
            }));
            toast.success('Item deleted');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete item');
            return false;
        }
    },

    // Lost Items Actions
    fetchLostItems: async () => {
        set({ lostLoading: true });
        try {
            const res = await api.get('/lost');
            set({ lostItems: res.data.data || [] });
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch lost items');
        } finally {
            set({ lostLoading: false });
        }
    },

    fetchLostItemById: async (id) => {
        set({ lostLoading: true });
        try {
            const res = await api.get(`/lost/${id}`);
            set({ lostItem: res.data });
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch item details');
        } finally {
            set({ lostLoading: false });
        }
    },

    fetchMyLostItems: async () => {
        set({ lostLoading: true });
        try {
            const res = await api.get('/lost/my');
            set({ myLostItems: res.data || [] });
        } catch (error) {
            console.error(error);
        } finally {
            set({ lostLoading: false });
        }
    },

    createLostItem: async (formData) => {
        set({ lostLoading: true });
        try {
            await api.post('/lost', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Lost item reported successfully');
            get().fetchLostItems();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to report item');
            return false;
        } finally {
            set({ lostLoading: false });
        }
    },

    deactivateLostItem: async (id) => {
        try {
            await api.patch(`/lost/${id}/deactivate`);
            set((state) => ({
                lostItems: state.lostItems.map(item => item._id === id ? { ...item, status: 'inactive' } : item),
                myLostItems: state.myLostItems.map(item => item._id === id ? { ...item, status: 'inactive' } : item),
                lostItem: state.lostItem?._id === id ? { ...state.lostItem, status: 'inactive' } : state.lostItem
            }));
            toast.success('Item deactivated');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to deactivate item');
        }
    },

    deleteLostItem: async (id) => {
        try {
            await api.delete(`/lost/${id}`);
            set((state) => ({
                lostItems: state.lostItems.filter(item => item._id !== id),
                myLostItems: state.myLostItems.filter(item => item._id !== id),
                lostItem: null
            }));
            toast.success('Item deleted');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete item');
            return false;
        }
    }

}));

export default useStore;
