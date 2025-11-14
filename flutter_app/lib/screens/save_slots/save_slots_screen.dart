import 'package:flutter/material.dart';
import '../../models/save_slot.dart';
import '../../services/save_slot_service.dart';

class SaveSlotsScreen extends StatefulWidget {
  final Function(SaveSlot) onSlotSelected;

  const SaveSlotsScreen({
    super.key,
    required this.onSlotSelected,
  });

  @override
  State<SaveSlotsScreen> createState() => _SaveSlotsScreenState();
}

class _SaveSlotsScreenState extends State<SaveSlotsScreen> {
  final SaveSlotService _saveSlotService = SaveSlotService();
  List<SaveSlot> _slots = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSlots();
  }

  Future<void> _loadSlots() async {
    setState(() {
      _isLoading = true;
    });

    final slots = await _saveSlotService.getAllSlots();

    setState(() {
      _slots = slots;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('저장 슬롯'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _slots.length,
              itemBuilder: (context, index) {
                return _buildSlotCard(_slots[index]);
              },
            ),
    );
  }

  Widget _buildSlotCard(SaveSlot slot) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () {
          if (!slot.isEmpty) {
            widget.onSlotSelected(slot);
          }
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: slot.isEmpty
              ? _buildEmptySlot(slot.slotNumber)
              : _buildFilledSlot(slot),
        ),
      ),
    );
  }

  Widget _buildEmptySlot(int slotNumber) {
    return Row(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Icon(
            Icons.add,
            color: Colors.grey,
            size: 32,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '슬롯 ${slotNumber + 1}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '비어있음',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFilledSlot(SaveSlot slot) {
    return Row(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.blue.shade400, Colors.blue.shade700],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Icon(
            Icons.save,
            color: Colors.white,
            size: 32,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                slot.playerName ?? '알 수 없음',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              if (slot.gameState != null)
                Text(
                  '에피소드 ${slot.gameState!.currentEpisodeId}',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey.shade700,
                  ),
                ),
              const SizedBox(height: 4),
              if (slot.lastSaved != null)
                Text(
                  '저장: ${_formatDate(slot.lastSaved!)}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
            ],
          ),
        ),
        PopupMenuButton(
          icon: const Icon(Icons.more_vert),
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  Icon(Icons.delete, color: Colors.red),
                  SizedBox(width: 8),
                  Text('삭제'),
                ],
              ),
            ),
          ],
          onSelected: (value) async {
            if (value == 'delete') {
              final confirmed = await _showDeleteConfirmation(context);
              if (confirmed == true) {
                await _saveSlotService.deleteSlot(slot.slotNumber);
                _loadSlots();
              }
            }
          },
        ),
      ],
    );
  }

  Future<bool?> _showDeleteConfirmation(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('저장 슬롯 삭제'),
        content: const Text('이 저장 슬롯을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('취소'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('삭제'),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.year}.${date.month.toString().padLeft(2, '0')}.${date.day.toString().padLeft(2, '0')} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}
