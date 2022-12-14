<?php

namespace App\Jobs;

use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\X264;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CompressVideos implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 2;
    public $timeout = 1900;

    protected $path;
    protected $temp;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($path, $name)
    {
        $this->path = $path;
        $this->temp = storage_path('temp/' . $name);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            if (!file_exists(storage_path('temp'))) {
                mkdir(storage_path('temp'), 0775, true);
            }

            $ffmpeg = FFMpeg::create([
                'ffmpeg.binaries' => '/usr/bin/ffmpeg',
                'ffprobe.binaries' => '/usr/bin/ffprobe',
                'timeout' => 1800
            ]);

            $video = $ffmpeg->open($this->path);
            if ($video->getStreams()->videos()->first()->get('height') > 1080) {
                $video->filters()->resize(new \FFMpeg\Coordinate\Dimension(1920, 1080))->synchronize();
            }
            $format = new X264();
            $format->setKiloBitrate(1500);
            $format->setAdditionalParameters(['-movflags', 'faststart']); // for streaming
            $video->save($format, $this->temp);

            if (file_exists($this->temp)) {
                unlink($this->path);
                rename($this->temp, $this->path);
            }
            else {
                throw new \Exception('Video compression failed.');
            }
        }
        catch (\Exception $e) {
            $this->fail($e->getMessage());
        }
    }
}

// TODO: RUN JOB IN PRODUCTION AND INSTALL FFMpeg ON SERVER
// TODO: sudo apt-get install ffmpeg
// TODO: sudo apt-get install supervisor + --rest=0.5 --sleep=5
