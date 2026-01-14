import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../utils/supabase';

export function useSupabaseData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const fetchAllData = async () => {
    setLoading(true);
    console.log('🔄 Fetching all data from Supabase...');
    
    try {
      const [vendorsData, blocksData, workersData] = await Promise.all([
        supabase.from('vendors').select('*').order('name'),
        supabase.from('blocks').select('*').order('name'),
        supabase.from('workers').select('*').order('name')
      ]);

      if (vendorsData.error) throw vendorsData.error;
      if (blocksData.error) throw blocksData.error;
      if (workersData.error) throw workersData.error;

      let transactionsData = await supabase
        .from('v_transactions_detail')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsData.error) {
        console.warn('⚠️ View not found, building transactions manually...');
        
        const rawTransactions = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (rawTransactions.error) throw rawTransactions.error;

        const detailedTransactions = await Promise.all(
          (rawTransactions.data || []).map(async (t) => {
            const vendor = vendorsData.data?.find(v => v.id === t.vendor_id);
            const block = blocksData.data?.find(b => b.id === t.block_id);
            
            const { data: transWorkers } = await supabase
              .from('transaction_workers')
              .select('worker_id')
              .eq('transaction_id', t.id);
            
            const workerIds = transWorkers?.map(tw => tw.worker_id) || [];
            const transactionWorkers = workersData.data?.filter(w => workerIds.includes(w.id)) || [];
            
            return {
              ...t,
              vendor_name: vendor?.name || 'Unknown',
              block_name: block?.name || 'Unknown',
              zone: block?.zone || '',
              kategori: block?.kategori || '',
              varietas: block?.varietas || '',
              jumlah_pekerja: transactionWorkers.length,
              workers: transactionWorkers.map(w => w.name),
              worker_codes: transactionWorkers.map(w => w.worker_code)
            };
          })
        );

        transactionsData = { data: detailedTransactions, error: null };
      }

      setVendors(vendorsData.data || []);
      setBlocks(blocksData.data || []);
      setWorkers(workersData.data || []);
      setTransactions(transactionsData.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const blocksWithBalance = useMemo(() => {
    return blocks.map(block => {
      const blockTransactions = transactions.filter(t => t.block_id === block.id);
      const totalDikerjakan = blockTransactions.reduce((sum, t) => sum + parseFloat(t.luas_hasil || 0), 0);
      const luasSisa = parseFloat((block.luas_asli - totalDikerjakan).toFixed(2));
      const persenSelesai = parseFloat(((totalDikerjakan / block.luas_asli) * 100).toFixed(2));

      return {
        ...block,
        luas_dikerjakan: parseFloat(totalDikerjakan.toFixed(2)),
        luas_sisa: luasSisa,
        persen_selesai: persenSelesai
      };
    });
  }, [blocks, transactions]);

  const uniqueZones = [...new Set(blocks.map(b => b.zone))];
  const uniqueKategori = [...new Set(blocks.map(b => b.kategori))];
  const uniqueVarietas = [...new Set(blocks.map(b => b.varietas))];

  return {
    loading,
    error,
    vendors,
    blocks,
    workers,
    transactions,
    blocksWithBalance,
    uniqueZones,
    uniqueKategori,
    uniqueVarietas,
    fetchAllData
  };
}
