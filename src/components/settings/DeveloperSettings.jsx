import React from 'react';
import { User01 } from '@untitledui/icons';

const developers = [
  {
    name: 'Zidan Daffa Ramadhan',
    role: 'Project Manager',
    avatar: 'ZD',
    color: 'bg-[#FF4628]',
  },
  {
    name: 'Chiqo Nanda Rial Pratama',
    role: 'Jr. Backend Developer',
    avatar: 'CN',
    color: 'bg-[#3B82F6]',
  },
  {
    name: 'Ahmad Dani',
    role: 'Internet of Things Engineer',
    avatar: 'AD',
    color: 'bg-[#16A34A]',
  },
  {
    name: 'Fikri Abiyyu Rahman',
    role: 'Jr. Fullstack Developer',
    avatar: 'FA',
    color: 'bg-[#F59E0B]',
  },
];

const DeveloperSettings = () => {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[#202020]">Developer</h2>
        <p className="text-[13px] text-[#8C9BAF] mt-1">Tim pengembang KIDECO Dashboard</p>
      </div>

      <div className="flex flex-col gap-3">
        {developers.map((dev, index) => (
          <div
            key={index}
            className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[12px] p-4 flex items-center gap-4"
          >
            <div className={`w-[48px] h-[48px] rounded-[10px] ${dev.color} flex items-center justify-center shrink-0`}>
              <span className="text-[16px] font-bold text-white">{dev.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-[#202020]">{dev.name}</div>
              <div className="text-[12px] text-[#8C9BAF] mt-0.5">{dev.role}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-[#EAECF0]">
        <div className="text-center">
          <div className="text-[12px] text-[#B9C8D7]">KIDECO Dashboard v1.0.0</div>
          <div className="text-[11px] text-[#D1D5DB] mt-1">Mining Water Quality Monitoring System</div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettings;
